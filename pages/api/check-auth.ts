import { checkAuth } from "../../utils/backend/check-auth";
export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return checkAuth(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
