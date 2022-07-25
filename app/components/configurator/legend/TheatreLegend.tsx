export default function TheatreLegend() {
  return (
    <div className="legend mt-2 flex flex-col gap-2">
      <h4 className="text-lg font-bold">Legend</h4>
      <div className="legend-seats-items flex flex-col gap-4 md:flex-row md:items-center">
        <div className="free-seat rounded-lg border border-dashed border-gray-700 p-1">
          <span className="text-xs">Free space</span>
        </div>
        <div className="legend-configured-seat rounded-lg border border-dashed border-gray-700 bg-gray-700 p-1 text-white">
          <span className="text-xs">Configured space</span>
        </div>
        <div className="legend-reserved-seat rounded-lg border border-dashed border-indigo-600 bg-indigo-700 p-1 text-white">
          <span className="text-xs">Reserved seat</span>
        </div>
        <div className="legend-entrance-exit rounded-lg bg-green-600 p-1 text-white">
          <span className="text-xs">Exit/Entrance</span>
        </div>
        <div className="legend-screen rounded-full bg-slate-700 p-1.5 text-slate-300">
          <span className="text-xs">Screen</span>
        </div>
      </div>
      <p className="text-xs">
        Free spaces can be considered as hallways, as long as they traverse
        through a specific or entire width/height of the room
      </p>
    </div>
  );
}
