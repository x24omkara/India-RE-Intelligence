export default function middleware(request) {

  const auth = request.headers.get("authorization");

  if (auth) {
    const encoded = auth.split(" ")[1];
    const decoded = atob(encoded);
    const password = decoded.split(":")[1];

    if (password === process.env.AVAADA_PASSWORD) {
      return new Response(null, { status: 200 });
    }
  }

  return new Response("Password required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Avaada Dashboard"',
    },
  });
}
