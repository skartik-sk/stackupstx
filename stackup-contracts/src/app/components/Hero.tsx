export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-orange-600 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            Built on Stacks • Secured by Bitcoin
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Boost the{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Stacks Ecosystem
            </span>
            {' '}with Stack Up
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            The ultimate platform for bounties, projects, grants, and innovative ideas. 
            Connect with the Stacks community, fund amazing projects, and help build the 
            future of decentralized applications.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg">
              Start Exploring
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Submit a Project
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">127</div>
              <div className="text-gray-600">Active Bounties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">₿ 12.5</div>
              <div className="text-gray-600">Total Rewards</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">1,247</div>
              <div className="text-gray-600">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">89</div>
              <div className="text-gray-600">Completed Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200 rounded-full opacity-20 filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-200 rounded-full opacity-20 filter blur-3xl"></div>
      </div>
    </section>
  );
}
