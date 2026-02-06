export default function StatsCards({dashboard}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div className="bg-white p-5 rounded shadow">
        <h3>Total Users</h3>
        <p className="text-3xl font-bold text-blue-600">{dashboard?.users ?? 0}</p>
      </div>

      <div className="bg-white p-5 rounded shadow">
        <h3>Total Stores</h3>
        <p className="text-3xl font-bold text-green-600">{dashboard?.stores ?? 0}</p>
      </div>

      <div className="bg-white p-5 rounded shadow">
        <h3>Total Ratings</h3>
        <p className="text-3xl font-bold text-purple-600">{dashboard?.ratings ?? 0}</p>
      </div>

    </div>
  );
}
