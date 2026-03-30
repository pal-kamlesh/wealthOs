export default function MongoDBNote() {
  return (
    <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🍃</span>
        <div>
          <div className="text-sm font-semibold text-slate-300 mb-1.5">
            Backend Connected ✓
          </div>
          <div className="text-xs text-slate-500 leading-relaxed space-y-1">
            <p>
              Your app is now connected to MongoDB and Express backend! All
              expenses are persisted in the database and sync across users.
            </p>
            <p className="text-slate-600">
              Your data schema:{" "}
              <code className="text-green-400 bg-slate-800 px-1 rounded">
                {
                  "{ _id, userId, date, category, amount, note, createdAt }"
                }
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
