export const orderIdPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;

async function redis(command) {
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Falha ao acessar o armazenamento de pedidos.");
  const { result, error } = await response.json();
  if (error) throw new Error("Falha ao executar operação de pedido.");
  return result;
}

const orderKey = (id) => "agroterry:checkout:order:" + id;

export async function createOrder(id, { title, amountCents }) {
  const order = { title, amountCents, status: "pending", payments: {} };
  const result = await redis(["SET", orderKey(id), JSON.stringify(order), "NX"]);
  if (result !== "OK") throw new Error("Falha ao registrar o pedido.");
}

export async function getOrder(id) {
  if (typeof id !== "string" || !orderIdPattern.test(id)) return null;
  const result = await redis(["GET", orderKey(id)]);
  return result ? JSON.parse(result) : null;
}

// Redis executes the read, status calculation and write as a single operation.
const updatePaymentScript = `
local current = redis.call('GET', KEYS[1])
if not current then return 0 end
local order = cjson.decode(current)
if order.amountCents ~= tonumber(ARGV[2]) then return 0 end

local paymentId = ARGV[1]
local timestamp = tonumber(ARGV[3])
local status = ARGV[4]
local previous = order.payments[paymentId]
if previous and previous.timestamp >= timestamp then return 0 end

order.payments[paymentId] = { timestamp = timestamp, status = status }
local priorities = { rejected = 1, pending = 2, reversed = 3, approved = 4 }
order.status = 'rejected'
for _, payment in pairs(order.payments) do
  if priorities[payment.status] > priorities[order.status] then
    order.status = payment.status
  end
end
redis.call('SET', KEYS[1], cjson.encode(order))
return 1
`;

export async function recordPayment(orderId, payment) {
  await redis([
    "EVAL", updatePaymentScript, 1, orderKey(orderId),
    payment.id, payment.amountCents, payment.updatedAt, payment.status,
  ]);
}
