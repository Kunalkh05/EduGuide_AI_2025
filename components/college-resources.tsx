"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Phone, Mail, Clock, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Resource {
  id: string
  college_name: string
  resource_type: string
  resource_name: string
  description: string
  contact_info: string
  availability_hours: string
  is_active: boolean
}

export function CollegeResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [collegeFilter, setCollegeFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchResources() {
      const supabase = createClient()

      try {
        const { data, error } = await supabase
          .from("college_resources")
          .select("*")
          .eq("is_active", true)
          .order("college_name")

        if (error) throw error
        setResources(data || [])
        setFilteredResources(data || [])
      } catch (error) {
        console.error("Error fetching resources:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [])

  useEffect(() => {
    let filtered = resources

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (resource) =>
          resource.resource_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.college_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // College filter
    if (collegeFilter !== "all") {
      filtered = filtered.filter((resource) => resource.college_name === collegeFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((resource) => resource.resource_type === typeFilter)
    }

    setFilteredResources(filtered)
  }, [resources, searchTerm, collegeFilter, typeFilter])

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case "academic_support":
        return "bg-blue-100 text-blue-800"
      case "mental_health":
        return "bg-red-100 text-red-800"
      case "career_services":
        return "bg-green-100 text-green-800"
      case "financial_aid":
        return "bg-yellow-100 text-yellow-800"
      case "counseling":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const uniqueColleges = [...new Set(resources.map((r) => r.college_name))]
  const resourceTypes = [...new Set(resources.map((r) => r.resource_type))]

  if (isLoading) {
    return <div>Loading resources...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">College Resources</h1>
        <p className="text-muted-foreground mt-2">
          Find academic support, counseling services, and other resources available at your college
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={collegeFilter} onValueChange={setCollegeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by college" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colleges</SelectItem>
            {uniqueColleges.map((college) => (
              <SelectItem key={college} value={college}>
                {college}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {resourceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Resources Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{resource.resource_name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {resource.college_name}
                  </CardDescription>
                </div>
                <Badge className={getResourceTypeColor(resource.resource_type)}>
                  {resource.resource_type.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{resource.description}</p>

              {resource.contact_info && (
                <div className="flex items-center gap-2 text-sm">
                  {resource.contact_info.includes("@") ? (
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-muted-foreground">{resource.contact_info}</span>
                </div>
              )}

              {resource.availability_hours && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{resource.availability_hours}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No resources found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
