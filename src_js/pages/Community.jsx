import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Footer } from "@/components/Footer";
import {
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Share, 
  Plus, 
  Search, 
  Filter,
  User,
  Clock,
  Eye,
  Bookmark
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Community = () => {
  const { toast } = useToast();
  const location = useLocation();
  
  // Detect if user is guide or migrant based on route
  const isGuide = location.pathname === '/guide/community';
  const isMigrant = !isGuide;
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Just got my Canada PR! Here's my complete timeline and experience",
      content: "After 18 months of preparation, I finally received my Canadian Permanent Residence. Here's everything that worked for me and what I'd do differently...",
      author: "Priya K.",
      authorRole: "Guide",
      votes: 47,
      userVote: null,
      comments: 23,
      views: 1200,
      timeAgo: "3 hours ago",
      tags: ["canada", "pr", "success-story"],
      country: "Canada"
    },
    {
      id: 2, 
      title: "Help needed: Germany job search strategies for software engineers",
      content: "I've been applying for software engineering roles in Germany for 3 months with no luck. What platforms work best? Should I learn German first?",
      author: "Rahul M.",
      authorRole: "Voyager",
      votes: 15,
      userVote: null,
      comments: 18,
      views: 890,
      timeAgo: "6 hours ago",
      tags: ["germany", "tech", "job-search"],
      country: "Germany"
    },
    {
      id: 3,
      title: "Australia vs New Zealand: Which is better for IT professionals?",
      content: "I'm torn between Australia and New Zealand for my next move. Both have great opportunities but different lifestyles. What's your experience?",
      author: "Saurabh V.",
      authorRole: "Voyager", 
      votes: 31,
      userVote: null,
      comments: 35,
      views: 1450,
      timeAgo: "1 day ago",
      tags: ["australia", "new-zealand", "comparison"],
      country: "Australia"
    }
  ]);

  const [sortBy, setSortBy] = useState("hot");
  const [searchTerm, setSearchTerm] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState("");

  const handleVote = (postId, voteType) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        let newVotes = post.votes;
        let newUserVote = voteType;

        // Handle vote logic
        if (post.userVote === voteType) {
          // Remove vote if clicking same vote
          newUserVote = null;
          newVotes += voteType === "up" ? -1 : 1;
        } else if (post.userVote) {
          // Change from opposite vote
          newVotes += voteType === "up" ? 2 : -2;
        } else {
          // New vote
          newVotes += voteType === "up" ? 1 : -1;
        }

        return { ...post, votes: newVotes, userVote: newUserVote };
      }
      return post;
    }));

    toast({
      description: `${voteType === "up" ? "Upvoted" : "Downvoted"} post successfully!`,
    });
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        variant: "destructive",
        description: "Please fill in both title and content.",
      });
      return;
    }

    const newPost = {
      id: Date.now(),
      title: newPostTitle,
      content: newPostContent,
      author: "You",
      authorRole: "Voyager",
      votes: 1,
      userVote: "up",
      comments: 0,
      views: 0,
      timeAgo: "Just now",
      tags: newPostTags.split(",").map(tag => tag.trim()).filter(Boolean)
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostTags("");

    toast({
      description: "Post created successfully!",
    });
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {isGuide ? "Guide Community" : "Community"}
              </h1>
              <p className="text-muted-foreground">
                {isGuide 
                  ? "Connect with fellow guides and share your expertise" 
                  : "Connect, share, and learn from fellow migrants"
                }
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="hero" className="shadow-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Post title..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Share your experience, ask questions, or start a discussion..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={6}
                  />
                  <Input
                    placeholder="Tags (comma separated): canada, visa, tech..."
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                  />
                  <Button onClick={handleCreatePost} variant="hero" className="w-full">
                    Post to Community
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>
            {/* Sort Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Sort By
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { key: "hot", label: "🔥 Hot" },
                  { key: "new", label: "🆕 New" },
                  { key: "top", label: "⭐ Top" }
                ].map((option) => (
                  <Button
                    key={option.key}
                    variant={sortBy === option.key ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSortBy(option.key)}
                  >
                    {option.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
            {/* Popular Tags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["canada", "visa", "tech", "germany", "australia", "uk"].map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-soft transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    {/* Voting */}
                    <div className="flex flex-col items-center space-y-1 mr-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${post.userVote === "up" ? "text-primary bg-primary/10" : "hover:text-primary"}`}
                        onClick={() => handleVote(post.id, "up")}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <span className={`font-semibold text-sm ${post.votes > 0 ? "text-primary" : post.votes < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                        {post.votes}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${post.userVote === "down" ? "text-destructive bg-destructive/10" : "hover:text-destructive"}`}
                        onClick={() => handleVote(post.id, "down")}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                    {/* Post Content */}
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold hover:text-primary cursor-pointer line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3">
                          {post.content}
                        </p>
                      </div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {/* Post Meta */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                            <Badge 
                              variant={post.authorRole === "Guide" ? "default" : "secondary"} 
                              className="text-xs"
                            >
                              {post.authorRole}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="h-8">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            <Share className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Community;
