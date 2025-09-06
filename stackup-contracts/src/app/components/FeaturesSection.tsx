export function FeaturesSection() {
  const features = [
    {
      icon: '🎯',
      title: 'Bounties',
      description: 'Post and complete bounties with secure escrow payments. Perfect for quick tasks and specific challenges.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🚀',
      title: 'Projects',
      description: 'Multi-milestone projects with timeline-based payments. Build complex applications with ongoing support.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: '💰',
      title: 'Grants',
      description: 'Apply for grants to fund your innovative ideas. Get backing for projects that push the ecosystem forward.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '💡',
      title: 'Ideas',
      description: 'Share your ideas and get AI-powered analysis. Discover difficulty ratings and avoid duplicate concepts.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Everything You Need to Build on Stacks
          </h2>
          <p className="text-lg text-gray-600">
            Four powerful tools to help you contribute to and benefit from the Stacks ecosystem.
            Each with built-in security and transparent processes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
            </div>
          ))}
        </div>

        {/* Application Limits Section */}
        <div className="mt-20 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 lg:p-12 border border-orange-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Fair Access with Staking System
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Every user gets 4 free applications per month. Need more? Stake STX tokens to unlock additional applications. 
              This keeps the platform accessible while preventing spam.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-orange-500 mb-2">4</div>
                <div className="text-gray-900 font-medium mb-1">Free Applications</div>
                <div className="text-sm text-gray-500">Per month, per user</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-orange-500 mb-2">1 STX</div>
                <div className="text-gray-900 font-medium mb-1">Reset Cost</div>
                <div className="text-sm text-gray-500">To unlock 4 more applications</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-orange-500 mb-2">∞</div>
                <div className="text-gray-900 font-medium mb-1">Unlimited</div>
                <div className="text-sm text-gray-500">With sufficient staking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
