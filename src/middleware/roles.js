export function allowRoles(...allowed) {
  return (req, res, next) => {
    if (!allowed.includes(req.admin.role)) {
      return res.json({ success: false, message: "Access denied" });
    }
    next();
  };
}
