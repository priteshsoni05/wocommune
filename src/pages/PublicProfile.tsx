import React from "react";
import { useParams } from "react-router-dom";
import { useProfile, useServices } from "@/hooks/profile";
import { Loader } from "@/components/ui/loader";

export default function PublicProfile() {
  const { id } = useParams();
  const { data: profile, isLoading: profileLoading } = useProfile(id);
  const { data: services, isLoading: servicesLoading } = useServices(id);

  if (profileLoading || servicesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen text-muted-foreground">
        Profile not found.
      </div>
    );
  }

  const handleServiceBook = (service: any) => {
    console.log("Book service:", service);
    // connect booking flow here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header stays */}

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center lg:items-start gap-4">
            {/* Avatar */}
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-32 h-32 rounded-full border border-border"
            />

            {/* Name + Short Bio */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.short_bio}</p>
            </div>

            {/* Socials */}
            {profile.socials && (
              <div className="flex gap-3">
                {profile.socials.map((social: any, i: number) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted hover:bg-primary/10 transition"
                  >
                    <social.icon className="h-5 w-5 text-primary" />
                  </a>
                ))}
              </div>
            )}

            {/* Contact Button */}
            <button
              className="px-6 py-2 rounded-full font-semibold text-white hover:opacity-90 transition"
              style={{ backgroundColor: "#193232" }}
            >
              Contact
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-10">
          {/* About Section */}
          {profile.about && (
            <section className="border-b border-border pb-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profile.about}
              </p>
            </section>
          )}

          {/* Key Details */}
          <section className="border-b border-border pb-6">
            <h2 className="text-xl font-semibold mb-4">Key Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
              {profile.reviews && (
                <div>
                  <div className="font-medium">Reviews</div>
                  <div className="text-muted-foreground">{profile.reviews}</div>
                </div>
              )}
              {profile.education && (
                <div>
                  <div className="font-medium">Education</div>
                  <div className="text-muted-foreground">{profile.education}</div>
                </div>
              )}
              {profile.experience && (
                <div>
                  <div className="font-medium">Experience</div>
                  <div className="text-muted-foreground">{profile.experience}</div>
                </div>
              )}
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Services</h2>
            <div className="space-y-6">
              {services?.map((service: any, index: number) => (
                <div
                  key={service.id}
                  className="pb-6 border-b border-border last:border-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Info */}
                    <div>
                      <h3 className="text-lg font-medium">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>

                    {/* Pricing + Button */}
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <span className="text-lg font-bold text-primary">
                        ₹{service.price_per_hour}
                      </span>
                      {service.duration_minutes && (
                        <span className="text-sm text-muted-foreground">
                          {service.duration_minutes} min
                        </span>
                      )}
                      <button
                        onClick={() => handleServiceBook(service)}
                        className="px-5 py-2 rounded-full text-white font-semibold hover:opacity-90 transition"
                        style={{ backgroundColor: "#193232" }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Sticky CTA on Mobile */}
      <div className="fixed bottom-4 left-0 right-0 px-4 lg:hidden">
        <button
          className="w-full px-6 py-3 rounded-full text-white font-semibold shadow-lg"
          style={{ backgroundColor: "#193232" }}
        >
          View Services
        </button>
      </div>
    </div>
  );
}
