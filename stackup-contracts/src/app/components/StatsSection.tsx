export function StatsSection() {
  const stats = [
    {
      number: "127",
      label: "Active Bounties",
      description: "Tasks waiting to be completed",
      trend: "+12% this week"
    },
    {
      number: "₿ 12.5",
      label: "Total Value Locked",
      description: "Secured in smart contracts",
      trend: "+23% this month"
    },
    {
      number: "1,247",
      label: "Community Builders",
      description: "Active contributors",
      trend: "+34% this month"
    },
    {
      number: "89",
      label: "Projects Completed",
      description: "Successfully delivered",
      trend: "+8% this week"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Building the Future of Stacks
          </h2>
          <p className="text-xl text-gray-300">
            Join thousands of developers, designers, and innovators contributing to the Stacks ecosystem.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300"
            >
              <div className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-white mb-2">
                {stat.label}
              </div>
              <div className="text-gray-400 text-sm mb-3">
                {stat.description}
              </div>
              <div className="text-green-400 text-sm font-medium">
                {stat.trend}
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
            <p className="text-gray-400">
              Link your Stacks wallet, GitHub, and Twitter to create a verified profile and start participating.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Choose Your Path</h3>
            <p className="text-gray-400">
              Browse bounties, apply for grants, start projects, or share ideas. Each with secure smart contract backing.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Get Rewarded</h3>
            <p className="text-gray-400">
              Complete tasks and receive payments automatically through our escrow system, powered by Clarity smart contracts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
