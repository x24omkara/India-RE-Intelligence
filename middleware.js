export function middleware(request) {

  const url = request.nextUrl;

  // only protect /avaada routes
  if (!url.pathname.startsWith("/avaada")) {
    return;
  }

  const auth = request.headers.get("authorization");

  if (auth) {
    const encoded = auth.split(" ")[1];
    const decoded = atob(encoded);
    const [user, pass] = decoded.split(":");

    if (pass === process.env.AVAADA_PASSWORD) {
      return;
    }
  }

  return new Response("Password required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Avaada Dashboard"',
    },
  });
}
