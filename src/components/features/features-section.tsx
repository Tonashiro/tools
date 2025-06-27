'use client'

import Link from 'next/link'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  ImageIcon, 
  Users, 
  BarChart3, 
  Settings,
  ArrowRight,
  Sparkles
} from 'lucide-react'

const features = [
  {
    id: 'nft-snapshoter',
    title: 'NFT Snapshoter',
    description: 'Capture and analyze NFT collections with detailed metadata and ownership tracking.',
    icon: ImageIcon,
    href: '/nft-snapshoter',
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
    comingSoon: false
  },
  {
    id: 'community-analytics',
    title: 'Community Analytics',
    description: 'Deep insights into Discord server engagement, member activity, and growth metrics.',
    icon: Users,
    href: '/community-analytics',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
    comingSoon: true
  },
  {
    id: 'trading-dashboard',
    title: 'Trading Dashboard',
    description: 'Real-time market data, portfolio tracking, and advanced trading analytics.',
    icon: BarChart3,
    href: '/trading-dashboard',
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
    comingSoon: true
  },
  {
    id: 'project-settings',
    title: 'Project Settings',
    description: 'Configure your project preferences, API keys, and integration settings.',
    icon: Settings,
    href: '/settings',
    color: 'from-orange-500 to-red-500',
    gradient: 'bg-gradient-to-br from-orange-500/10 to-red-500/10',
    comingSoon: false
  }
]

export function FeaturesSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Powerful Tools</h2>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our suite of tools designed to enhance your NFT and community management experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => {
            const IconComponent = feature.icon
            
            return (
              <Link 
                key={feature.id} 
                href={feature.href}
                className="group block"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 border-2 hover:border-primary/20 overflow-hidden relative">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                              {feature.title}
                            </CardTitle>
                            {feature.comingSoon && (
                              <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
                                Coming Soon
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            More tools coming soon! Stay tuned for updates.
          </p>
        </div>
      </div>
    </section>
  )
} 