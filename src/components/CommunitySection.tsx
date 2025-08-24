import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ThumbsUp, Eye, Clock, User, ChevronRight } from "lucide-react";

export const CommunitySection = () => {
  const questions = [
    {
      id: 1,
      title: "Best cities for tech professionals in Canada?",
      excerpt: "I'm a software engineer looking to move to Canada. Which cities offer the best opportunities for growth and work-life balance?",
      author: "Priya K.",
      authorRole: "Voyager",
      replies: 15,
      views: 234,
      upvotes: 12,
      timeAgo: "2 hours ago",
      tags: ["canada", "tech", "cities"]
    },
    {
      id: 2,
      title: "Germany visa process timeline - 2024 update",
      excerpt: "Just got my Germany work visa approved! Here's the complete timeline and documents I used...",
      author: "Rahul M.",
      authorRole: "Guide",
      replies: 28,
      views: 567,
      upvotes: 34,
      timeAgo: "5 hours ago",
      tags: ["germany", "visa", "timeline"]
    },
    {
      id: 3,
      title: "Cost of living comparison: London vs Amsterdam",
      excerpt: "For those choosing between UK and Netherlands, here's my detailed breakdown after living in both cities for 2+ years each.",
      author: "Saurabh V.",
      authorRole: "Guide",
      replies: 22,
      views: 445,
      upvotes: 28,
      timeAgo: "1 day ago",
      tags: ["cost-of-living", "london", "amsterdam"]
    }
  ];

  const blogs = [
    {
      id: 1,
      title: "My First Year in Australia: What I Wish I Knew",
      excerpt: "From finding accommodation to understanding the work culture, here are the key insights that would have made my transition smoother...",
      author: "Anita S.",
      readTime: "8 min read",
      image: "/api/placeholder/400/200",
      likes: 156,
      views: 2300
    },
    {
      id: 2,
      title: "Breaking into Tech in the US: A Non-CS Graduate's Journey",
      excerpt: "How I transitioned from mechanical engineering to software development and landed a job at a Fortune 500 company in Silicon Valley...",
      author: "Vikram P.",
      readTime: "12 min read", 
      image: "/api/placeholder/400/200",
      likes: 203,
      views: 3100
    }
  ];

  return (
    <section id="community" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold">
            Join the{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Community
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow migrants, ask questions, share experiences, and learn from expert guides.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Q&A Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Latest Questions</h3>
              <Button variant="outline" className="group">
                View All
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="space-y-4">
              {questions.map((question) => (
                <Card key={question.id} className="hover:shadow-soft transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Question Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                            {question.title}
                          </h4>
                          <p className="text-muted-foreground mt-2 line-clamp-2">
                            {question.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Question Footer */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{question.author}</span>
                            <Badge variant={question.authorRole === "Guide" ? "default" : "secondary"} className="text-xs">
                              {question.authorRole}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{question.timeAgo}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{question.upvotes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{question.replies}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{question.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Blog Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Featured Blogs</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {blogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-soft transition-all duration-300 cursor-pointer group overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <Badge className="mb-2">{blog.readTime}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {blog.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>by {blog.author}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{blog.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{blog.views}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Card */}
            <Card className="gradient-card border-2 border-primary/20">
              <CardContent className="p-6 text-center space-y-4">
                <h4 className="text-lg font-semibold">Start Contributing</h4>
                <p className="text-sm text-muted-foreground">
                  Share your experience and help others in their migration journey.
                </p>
                <Button variant="hero" className="w-full">
                  Ask a Question
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};