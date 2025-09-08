import React from "react";

const DashboardHome = () => {
  return (
    <div className="min-h-screen  font-sans">
      {/* Main Content */}
      <main className="p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className=" mt-1">Overview of system status and key metrics</p>
        </header>

        {/* System Status Section */}
        <section className="text-white">
          <h2 className="text-2xl font-semibold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-md border border-gray-700">
              <p className=" font-medium ">Datasets</p>
              <p className="text-3xl font-bold mt-2">120</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md border border-gray-700">
              <p className="text-base font-medium ">Sensors</p>
              <p className="text-3xl font-bold mt-2">350</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md border border-gray-700">
              <p className=" font-medium ">Models</p>
              <p className="text-3xl font-bold mt-2">15</p>
            </div>
          </div>
        </section>

        {/* Data Management Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Data Management</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-md overflow-hidden border border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-bold">Upload New Dataset</h3>
                <p className=" text-sm mt-1">
                  Import new data for analysis and model training.
                </p>
                <button className="mt-4 flex items-center justify-center rounded-md h-10 px-5 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                  Upload
                </button>
              </div>
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500"></div>
            </div>
            <div className="bg-gray-800 rounded-md overflow-hidden border border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-bold">Manage Existing Datasets</h3>
                <p className=" text-sm mt-1">
                  View, edit, and delete existing datasets.
                </p>
                <button className="mt-4 flex items-center justify-center rounded-md h-10 px-5 bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition-colors">
                  Manage
                </button>
              </div>
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500"></div>
            </div>
          </div>
        </section>

        {/* Sensor Management Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Sensor Management</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-md overflow-hidden border border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-bold">Configure Sensors</h3>
                <p className=" text-sm mt-1">
                  Set up and manage sensor configurations.
                </p>
                <button className="mt-4 flex items-center justify-center rounded-md h-10 px-5 bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition-colors">
                  Configure
                </button>
              </div>
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500"></div>
            </div>
            <div className="bg-gray-800 rounded-md overflow-hidden border border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-bold">Monitor Sensor Status</h3>
                <p className=" text-sm mt-1">
                  View real-time status and data from connected sensors.
                </p>
                <button className="mt-4 flex items-center justify-center rounded-md h-10 px-5 bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition-colors">
                  Monitor
                </button>
              </div>
              <div className="h-48 bg-gradient-to-br from-teal-400 to-cyan-500"></div>
            </div>
          </div>
        </section>

        {/* Model Management Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Model Management</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-md overflow-hidden border border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-bold">Deploy New Model</h3>
                <p className=" text-sm mt-1">
                  Deploy a new AI model for field monitoring.
                </p>
                <button className="mt-4 flex items-center justify-center rounded-md h-10 px-5 bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition-colors">
                  Deploy
                </button>
              </div>
              <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500"></div>
            </div>
            <div className="bg-gray-800 rounded-md overflow-hidden border border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-bold">Monitor Model Performance</h3>
                <p className=" text-sm mt-1">
                  Track the performance of deployed models.
                </p>
                <button className="mt-4 flex items-center justify-center rounded-md h-10 px-5 bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition-colors">
                  Monitor
                </button>
              </div>
              <div className="h-48 bg-gradient-to-br from-pink-400 to-red-500"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardHome;
