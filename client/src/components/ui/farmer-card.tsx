import { Link } from "wouter";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { Star, MapPin, Calendar } from "lucide-react";

interface FarmerCardProps {
  farmer: any;
  showProducts?: boolean;
}

export default function FarmerCard({ farmer, showProducts = true }: FarmerCardProps) {
  const rating = parseFloat(farmer.rating || "0");
  const experienceYears = farmer.experience || 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`farmer-card-${farmer.id}`}>
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-2 mx-auto">
              {farmer.farmName ? farmer.farmName.charAt(0).toUpperCase() : 'F'}
            </div>
            <h3 className="font-semibold text-gray-900">{farmer.farmName}</h3>
          </div>
        </div>
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {farmer.verified && (
            <Badge className="bg-green-600 text-white">
              Verified
            </Badge>
          )}
          
          {experienceYears >= 10 && (
            <Badge className="bg-primary text-white">
              Expert
            </Badge>
          )}
          
          {farmer.specializations && farmer.specializations.includes('organic') && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Organic
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Farmer Info */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 mr-3"></div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900" data-testid={`farmer-name-${farmer.id}`}>
              Owner Name
            </h4>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {farmer.county}{farmer.subCounty ? `, ${farmer.subCounty}` : ''}
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
          {farmer.description || "Dedicated to providing fresh, quality produce."}
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm font-medium">{experienceYears}+ years</span>
            </div>
            <p className="text-xs text-gray-500">Experience</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center mb-1">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-current' : ''}`} 
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {rating.toFixed(1)} ({farmer.totalReviews || 0} reviews)
            </p>
          </div>
        </div>
        
        {/* Specializations */}
        {farmer.specializations && farmer.specializations.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Specializations</p>
            <div className="flex flex-wrap gap-1">
              {farmer.specializations.slice(0, 3).map((spec: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
              {farmer.specializations.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{farmer.specializations.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/farmers/${farmer.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Profile
            </Button>
          </Link>
          
          {showProducts && (
            <Link href={`/products?farmerId=${farmer.id}`} className="flex-1">
              <Button size="sm" className="w-full">
                View Products
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
