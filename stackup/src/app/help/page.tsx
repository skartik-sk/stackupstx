"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Book,
  MessageCircle,
  Mail,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  FileText,
  Video,
  Users,
} from "lucide-react"
import Link from "next/link"

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I connect my wallet?",
        answer:
          'Click the "Connect Wallet" button in the top right corner and select your preferred Stacks wallet (Leather, Xverse, or Asigna). Follow the prompts to authorize the connection.',
      },
      {
        question: "What wallets are supported?",
        answer:
          "We support all major Stacks wallets including Leather Wallet, Xverse, and Asigna. These wallets allow you to interact with the Stacks blockchain and manage your STX tokens.",
      },
      {
        question: "How do I verify my profile?",
        answer:
          "Go to your profile settings and connect your GitHub and Twitter accounts. Verification helps build trust in the community and may be required for certain bounties and grants.",
      },
      {
        question: "What are application limits?",
        answer:
          "Free users can submit 3-4 applications per month. This includes bounty applications, project submissions, grant applications, and idea submissions. Verified users may have higher limits.",
      },
    ],
  },
  {
    category: "Bounties",
    questions: [
      {
        question: "How do bounties work?",
        answer:
          "Bounties are one-time tasks posted by individuals or organizations. You can browse available bounties, apply with your proposal, and if selected, complete the work to earn the reward.",
      },
      {
        question: "How are bounty payments handled?",
        answer:
          "Bounty payments are held in escrow smart contracts. Once you complete the work and it's approved by the bounty creator, the payment is automatically released to your wallet.",
      },
      {
        question: "Can I post my own bounty?",
        answer:
          'Yes! Click "Post Bounty" on the bounties page and fill out the details. You\'ll need to deposit the bounty amount into escrow before it goes live.',
      },
      {
        question: "What happens if there's a dispute?",
        answer:
          "If there's a disagreement about bounty completion, both parties can request mediation through our dispute resolution process. A neutral third party will review the work and make a decision.",
      },
    ],
  },
  {
    category: "Projects",
    questions: [
      {
        question: "What's the difference between bounties and projects?",
        answer:
          "Bounties are one-time tasks, while projects are longer-term initiatives with milestone-based funding. Projects typically involve building complete applications or systems.",
      },
      {
        question: "How does milestone funding work?",
        answer:
          "Project funding is released in stages based on completed milestones. Each milestone has specific deliverables that must be approved before the next payment is released.",
      },
      {
        question: "Can I submit a project as a team?",
        answer:
          "Yes! You can submit projects as an individual or team. Make sure to specify all team members and their roles in your project proposal.",
      },
    ],
  },
  {
    category: "Grants",
    questions: [
      {
        question: "Who can apply for grants?",
        answer:
          "Grant eligibility varies by program. Some are open to individuals, others to teams, organizations, or academic institutions. Check each grant's specific requirements.",
      },
      {
        question: "How long does the grant application process take?",
        answer:
          "Grant review times vary by provider, typically 2-8 weeks. You'll receive updates on your application status via email and in your dashboard.",
      },
      {
        question: "Can I apply for multiple grants?",
        answer:
          "Yes, you can apply for multiple grants, but make sure you can fulfill the commitments of each if awarded. Some grants may have exclusivity requirements.",
      },
    ],
  },
  {
    category: "Ideas",
    questions: [
      {
        question: "How does AI idea analysis work?",
        answer:
          "Our AI analyzes your idea for technical difficulty, innovation potential, market viability, and similar existing solutions. This helps you refine your concept and understand its potential.",
      },
      {
        question: "What happens to my idea after submission?",
        answer:
          "Your idea becomes part of the community innovation hub where others can vote, provide feedback, and potentially collaborate. You retain ownership of your intellectual property.",
      },
      {
        question: "Can ideas become bounties or projects?",
        answer:
          "Popular ideas often evolve into bounties or funded projects. The platform helps facilitate this transition from concept to implementation.",
      },
    ],
  },
]

const resourcesData = [
  {
    title: "Platform Documentation",
    description: "Complete guide to using all platform features",
    icon: Book,
    link: "/docs",
    type: "Documentation",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides for common tasks",
    icon: Video,
    link: "/tutorials",
    type: "Video",
  },
  {
    title: "Community Forum",
    description: "Connect with other developers and get help",
    icon: Users,
    link: "/community",
    type: "Community",
  },
  {
    title: "API Documentation",
    description: "Technical documentation for developers",
    icon: FileText,
    link: "/api-docs",
    type: "API",
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFAQs, setFilteredFAQs] = useState(faqData)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredFAQs(faqData)
      return
    }

    const filtered = faqData
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) =>
            q.question.toLowerCase().includes(query.toLowerCase()) ||
            q.answer.toLowerCase().includes(query.toLowerCase()),
        ),
      }))
      .filter((category) => category.questions.length > 0)

    setFilteredFAQs(filtered)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-balance mb-4">Help & Support</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Find answers to common questions, browse our documentation, or get in touch with our support team
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              className="pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="faq" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Status
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-8">
            {filteredFAQs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or browse our categories below
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {filteredFAQs.map((category, categoryIndex) => (
                  <Card key={categoryIndex}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {category.category}
                        <Badge variant="secondary">{category.questions.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq, faqIndex) => (
                          <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resourcesData.map((resource, index) => {
                const Icon = resource.icon
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{resource.title}</h3>
                            <Badge variant="outline">{resource.type}</Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
                          <Link href={resource.link}>
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              View Resource
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Common tasks and important pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/create/bounty"
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span>Create a Bounty</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/apply/project"
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span>Submit a Project</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/create/idea"
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span>Share an Idea</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span>Account Settings</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Options */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>Choose the best way to reach our support team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-muted-foreground">support@stackshub.com</p>
                        <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-muted-foreground">Available 9 AM - 6 PM EST</p>
                        <p className="text-xs text-muted-foreground">Monday - Friday</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Community Forum</p>
                        <p className="text-sm text-muted-foreground">Get help from the community</p>
                        <p className="text-xs text-muted-foreground">24/7 community support</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Report an Issue</CardTitle>
                    <CardDescription>Found a bug or security issue?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-transparent" variant="outline">
                      Report Bug
                    </Button>
                    <Button className="w-full bg-transparent" variant="outline">
                      Security Issue
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>We'll get back to you as soon as possible</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="What can we help you with?" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>General Question</option>
                      <option>Technical Issue</option>
                      <option>Account Problem</option>
                      <option>Payment Issue</option>
                      <option>Feature Request</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      className="w-full p-2 border rounded-md h-32 resize-none"
                      placeholder="Describe your issue or question in detail..."
                    />
                  </div>

                  <Button className="w-full">Send Message</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value="status" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current status of all platform services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Platform API</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Operational
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Wallet Connections</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Operational
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Smart Contracts</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Operational
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">AI Analysis</span>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Degraded
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
                <CardDescription>Latest platform updates and maintenance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-2 border-primary pl-4 space-y-2">
                  <p className="font-medium">Platform Update v2.1.0</p>
                  <p className="text-sm text-muted-foreground">
                    Added new grant creation interface and improved search functionality
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>

                <div className="border-l-2 border-muted pl-4 space-y-2">
                  <p className="font-medium">Scheduled Maintenance</p>
                  <p className="text-sm text-muted-foreground">Database optimization completed successfully</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>

                <div className="border-l-2 border-muted pl-4 space-y-2">
                  <p className="font-medium">Security Update</p>
                  <p className="text-sm text-muted-foreground">Enhanced wallet connection security protocols</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
