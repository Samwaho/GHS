"use client";

import { ReactNode, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { defaultHomeContent } from "@/constants/home-content";
import { HomeContentData, homeContentSchema, homeIconOptions } from "@/schemas/home-content";
import { useTRPC } from "@/trpc/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadcareUploader } from "@/components/ui/uploadcare-uploader";

export default function HomeContentManager() {
  const t = useTRPC();
  const homeContentQuery = useQuery(t.admin.getHomeContent.queryOptions());
  const updateMutation = useMutation(t.admin.updateHomeContent.mutationOptions());

  const form = useForm<HomeContentData>({
    resolver: zodResolver(homeContentSchema),
    defaultValues: homeContentQuery.data ?? defaultHomeContent,
  });

  useEffect(() => {
    if (homeContentQuery.data) {
      form.reset(homeContentQuery.data);
    }
  }, [homeContentQuery.data, form]);

  const heroHighlightsArray = useFieldArray({
    control: form.control,
    name: "hero.highlights",
  });

  const aboutStatsArray = useFieldArray({
    control: form.control,
    name: "about.stats",
  });

  const featureHighlightsArray = useFieldArray({
    control: form.control,
    name: "features.highlights",
  });

  const featureStatsArray = useFieldArray({
    control: form.control,
    name: "features.scorecard.stats",
  });

  const servicesArray = useFieldArray({
    control: form.control,
    name: "servicesSection.services",
  });

  const testimonialMetricsArray = useFieldArray({
    control: form.control,
    name: "testimonialsSection.metrics",
  });

  const testimonialsArray = useFieldArray({
    control: form.control,
    name: "testimonialsSection.testimonials",
  });

  const contactCardsArray = useFieldArray({
    control: form.control,
    name: "contactSection.cards",
  });

  const contactHighlightsArray = useFieldArray({
    control: form.control,
    name: "contactSection.teamHighlights",
  });

  type StringArrayPath =
    | "about.paragraphs"
    | "features.scorecard.bullets"
    | "servicesSection.tags"
    | "servicesSection.perks";

  const heroImagePreview = form.watch("hero.image.url");
  const aboutImagePreview = form.watch("about.image.url");
  const contactImagePreview = form.watch("contactSection.image.url");
  const aboutParagraphs = form.watch("about.paragraphs");
  const featureScorecardBullets = form.watch("features.scorecard.bullets");
  const serviceTags = form.watch("servicesSection.tags");
  const servicePerks = form.watch("servicesSection.perks");

  const addStringItem = (path: StringArrayPath) => {
    const current = form.getValues(path) ?? [];
    form.setValue(path, [...current, ""], { shouldDirty: true });
  };

  const removeStringItem = (path: StringArrayPath, index: number) => {
    const current = form.getValues(path) ?? [];
    if (index < 0 || index >= current.length) return;
    const next = [...current];
    next.splice(index, 1);
    form.setValue(path, next, { shouldDirty: true });
  };

  const handleSubmit = async (values: HomeContentData) => {
    try {
      await updateMutation.mutateAsync(values);
      toast.success("Home page content updated");
      homeContentQuery.refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save home content");
    }
  };

  const isLoading = homeContentQuery.isLoading && !homeContentQuery.data;
  const isSaving = updateMutation.isPending;

  return (
    <Card>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-amber-700">
            <Loader2 className="mb-2 h-6 w-6 animate-spin" />
            <p className="text-sm">Loading home content...</p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="hero">
                <AccordionTrigger className="text-left text-lg font-semibold">Hero + Lounge</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <SectionDescription
                    title="Hero content"
                    description="Control the hero headline, supporting copy, imagery, and CTAs for authenticated vs guest visitors."
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledField label="Eyebrow">
                      <Input {...form.register("hero.eyebrow")} />
                    </LabeledField>
                    <LabeledField label="Title">
                      <Input {...form.register("hero.title")} />
                    </LabeledField>
                  </div>
                  <LabeledField label="Description">
                    <Textarea rows={3} {...form.register("hero.description")} />
                  </LabeledField>
                  <div className="space-y-4">
                    <LabeledField label="Hero image">
                      <UploadcareUploader
                        preview={heroImagePreview}
                        onUpload={({ cdnUrl, uuid }) => {
                          form.setValue("hero.image.url", cdnUrl, { shouldDirty: true });
                          form.setValue("hero.image.uuid", uuid, { shouldDirty: true });
                        }}
                        onRemove={() => {
                          form.setValue("hero.image.url", "", { shouldDirty: true });
                          form.setValue("hero.image.uuid", undefined, { shouldDirty: true });
                        }}
                      />
                    </LabeledField>
                    <div className="grid gap-4 md:grid-cols-2">
                      <LabeledField label="Hero image alt text">
                        <Input {...form.register("hero.image.alt")} />
                      </LabeledField>
                      <LabeledField label="Hero blur data URL (optional)">
                        <Input {...form.register("hero.image.blurDataURL")} />
                      </LabeledField>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <LabeledField label="Primary CTA label">
                      <Input {...form.register("hero.primaryCta.label")} />
                    </LabeledField>
                    <LabeledField label="Primary CTA href">
                      <Input {...form.register("hero.primaryCta.href")} />
                    </LabeledField>
                    <LabeledField label="Authenticated CTA label">
                      <Input {...form.register("hero.authenticatedCta.label")} />
                    </LabeledField>
                    <LabeledField label="Authenticated CTA href">
                      <Input {...form.register("hero.authenticatedCta.href")} />
                    </LabeledField>
                    <LabeledField label="Guest CTA label">
                      <Input {...form.register("hero.guestCta.label")} />
                    </LabeledField>
                    <LabeledField label="Guest CTA href">
                      <Input {...form.register("hero.guestCta.href")} />
                    </LabeledField>
                  </div>
                  <ArraySectionHeader
                    title="Hero highlight cards"
                    actionLabel="Add highlight"
                    onAdd={() =>
                      heroHighlightsArray.append({
                        eyebrow: "",
                        title: "",
                        description: "",
                        icon: "Sparkles",
                      })
                    }
                  />
                  <div className="space-y-4">
                    {heroHighlightsArray.fields.map((field, index) => (
                      <ArrayCard
                        key={field.id}
                        title={`Highlight ${index + 1}`}
                        onRemove={() => heroHighlightsArray.remove(index)}
                      >
                        <div className="grid gap-4 md:grid-cols-3">
                          <LabeledField label="Eyebrow">
                            <Input {...form.register(`hero.highlights.${index}.eyebrow` as const)} />
                          </LabeledField>
                          <LabeledField label="Title">
                            <Input {...form.register(`hero.highlights.${index}.title` as const)} />
                          </LabeledField>
                          <Controller
                            control={form.control}
                            name={`hero.highlights.${index}.icon` as const}
                            render={({ field }) => (
                              <LabeledField label="Icon">
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select icon" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {homeIconOptions.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </LabeledField>
                            )}
                          />
                        </div>
                        <LabeledField label="Description">
                          <Textarea rows={2} {...form.register(`hero.highlights.${index}.description` as const)} />
                        </LabeledField>
                      </ArrayCard>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="about">
                <AccordionTrigger className="text-left text-lg font-semibold">About section</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <SectionDescription
                    title="About content"
                    description="Update the origin story, supporting paragraphs, stats, and featured imagery."
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledField label="Eyebrow">
                      <Input {...form.register("about.eyebrow")} />
                    </LabeledField>
                    <LabeledField label="Title">
                      <Input {...form.register("about.title")} />
                    </LabeledField>
                  </div>
                  <ArraySectionHeader
                    title="Paragraphs"
                    actionLabel="Add paragraph"
                    onAdd={() => addStringItem("about.paragraphs")}
                  />
                  <div className="space-y-4">
                    {(aboutParagraphs ?? []).map((_, index) => (
                      <ArrayCard
                        key={`about-paragraph-${index}`}
                        title={`Paragraph ${index + 1}`}
                        onRemove={() => removeStringItem("about.paragraphs", index)}
                      >
                        <LabeledField>
                          <Textarea rows={3} {...form.register(`about.paragraphs.${index}` as const)} />
                        </LabeledField>
                      </ArrayCard>
                    ))}
                  </div>
                  <ArraySectionHeader
                    title="Stats"
                    actionLabel="Add stat"
                    onAdd={() =>
                      aboutStatsArray.append({
                        value: "",
                        label: "",
                      })
                    }
                  />
                  <div className="space-y-4">
                    {aboutStatsArray.fields.map((field, index) => (
                      <ArrayCard key={field.id} title={`Stat ${index + 1}`} onRemove={() => aboutStatsArray.remove(index)}>
                        <div className="grid gap-4 md:grid-cols-2">
                          <LabeledField label="Value">
                            <Input {...form.register(`about.stats.${index}.value` as const)} />
                          </LabeledField>
                          <LabeledField label="Label">
                            <Input {...form.register(`about.stats.${index}.label` as const)} />
                          </LabeledField>
                        </div>
                      </ArrayCard>
                    ))}
                  </div>
                  <LabeledField label="Quote">
                    <Textarea rows={2} {...form.register("about.quote")} />
                  </LabeledField>
                  <LabeledField label="Attribution">
                    <Input {...form.register("about.attribution")} />
                  </LabeledField>
                  <div className="space-y-4">
                    <LabeledField label="About image">
                      <UploadcareUploader
                        preview={aboutImagePreview}
                        onUpload={({ cdnUrl, uuid }) => {
                          form.setValue("about.image.url", cdnUrl, { shouldDirty: true });
                          form.setValue("about.image.uuid", uuid, { shouldDirty: true });
                        }}
                        onRemove={() => {
                          form.setValue("about.image.url", "", { shouldDirty: true });
                          form.setValue("about.image.uuid", undefined, { shouldDirty: true });
                        }}
                      />
                    </LabeledField>
                    <LabeledField label="Image alt text">
                      <Input {...form.register("about.image.alt")} />
                    </LabeledField>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="features">
                <AccordionTrigger className="text-left text-lg font-semibold">Signature tenets</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <SectionDescription
                    title="Feature highlights"
                    description="Configure differentiation copy, highlights, and the scorecard metrics."
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledField label="Eyebrow">
                      <Input {...form.register("features.eyebrow")} />
                    </LabeledField>
                    <LabeledField label="Title">
                      <Input {...form.register("features.title")} />
                    </LabeledField>
                  </div>
                  <LabeledField label="Description">
                    <Textarea rows={3} {...form.register("features.description")} />
                  </LabeledField>
                  <ArraySectionHeader
                    title="Highlights"
                    actionLabel="Add highlight"
                    onAdd={() =>
                      featureHighlightsArray.append({
                        title: "",
                        description: "",
                        icon: "Sparkles",
                      })
                    }
                  />
                  <div className="space-y-4">
                    {featureHighlightsArray.fields.map((field, index) => (
                      <ArrayCard
                        key={field.id}
                        title={`Highlight ${index + 1}`}
                        onRemove={() => featureHighlightsArray.remove(index)}
                      >
                        <div className="grid gap-4 md:grid-cols-3">
                          <LabeledField label="Title">
                            <Input {...form.register(`features.highlights.${index}.title` as const)} />
                          </LabeledField>
                          <Controller
                            control={form.control}
                            name={`features.highlights.${index}.icon` as const}
                            render={({ field }) => (
                              <LabeledField label="Icon">
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select icon" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {homeIconOptions.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </LabeledField>
                            )}
                          />
                        </div>
                        <LabeledField label="Description">
                          <Textarea rows={2} {...form.register(`features.highlights.${index}.description` as const)} />
                        </LabeledField>
                      </ArrayCard>
                    ))}
                  </div>
                  <SectionDescription title="Scorecard" description="Metric highlights beside the feature grid." />
                  <div className="grid gap-4 md:grid-cols-3">
                    <LabeledField label="Eyebrow">
                      <Input {...form.register("features.scorecard.eyebrow")} />
                    </LabeledField>
                    <LabeledField label="Title">
                      <Input {...form.register("features.scorecard.title")} />
                    </LabeledField>
                    <LabeledField label="Description">
                      <Input {...form.register("features.scorecard.description")} />
                    </LabeledField>
                  </div>
                  <ArraySectionHeader
                    title="Scorecard stats"
                    actionLabel="Add stat"
                    onAdd={() =>
                      featureStatsArray.append({
                        value: "",
                        label: "",
                      })
                    }
                  />
                  <div className="space-y-4">
                    {featureStatsArray.fields.map((field, index) => (
                      <ArrayCard
                        key={field.id}
                        title={`Score stat ${index + 1}`}
                        onRemove={() => featureStatsArray.remove(index)}
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <LabeledField label="Value">
                            <Input {...form.register(`features.scorecard.stats.${index}.value` as const)} />
                          </LabeledField>
                          <LabeledField label="Label">
                            <Input {...form.register(`features.scorecard.stats.${index}.label` as const)} />
                          </LabeledField>
                        </div>
                      </ArrayCard>
                    ))}
                  </div>
                  <ArraySectionHeader
                    title="Scorecard bullets"
                    actionLabel="Add bullet"
                    onAdd={() => addStringItem("features.scorecard.bullets")}
                  />
                  <div className="space-y-4">
                    {(featureScorecardBullets ?? []).map((_, index) => (
                      <ArrayCard
                        key={`feature-bullet-${index}`}
                        title={`Bullet ${index + 1}`}
                        onRemove={() => removeStringItem("features.scorecard.bullets", index)}
                      >
                        <LabeledField>
                          <Textarea rows={2} {...form.register(`features.scorecard.bullets.${index}` as const)} />
                        </LabeledField>
                      </ArrayCard>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="services">
                <AccordionTrigger className="text-left text-lg font-semibold">Services & perks</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <SectionDescription
                    title="Services grid"
                    description="Maintain the services showcased on the homepage along with tags and perk callouts."
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledField label="Eyebrow">
                      <Input {...form.register("servicesSection.eyebrow")} />
                    </LabeledField>
                    <LabeledField label="Title">
                      <Input {...form.register("servicesSection.title")} />
                    </LabeledField>
                  </div>
                  <LabeledField label="Description">
                    <Textarea rows={3} {...form.register("servicesSection.description")} />
                  </LabeledField>
                  <ArraySectionHeader title="Tags" actionLabel="Add tag" onAdd={() => addStringItem("servicesSection.tags")} />
                  <div className="space-y-4">
                    {(serviceTags ?? []).map((_, index) => (
                      <ArrayCard
                        key={`service-tag-${index}`}
                        title={`Tag ${index + 1}`}
                        onRemove={() => removeStringItem("servicesSection.tags", index)}
                      >
                        <LabeledField>
                          <Input {...form.register(`servicesSection.tags.${index}` as const)} />
                        </LabeledField>
                      </ArrayCard>
                    ))}
                  </div>
                  <ArraySectionHeader
                    title="Service cards"
                    actionLabel="Add service"
                    onAdd={() =>
                      servicesArray.append({
                        title: "",
                        description: "",
                        duration: "",
                        price: "",
                        image: "",
                      })
                    }
                  />
                  <div className="space-y-4">
                    {servicesArray.fields.map((field, index) => {
                      const serviceImagePreview = form.watch(`servicesSection.services.${index}.image` as const);
                      return (
                      <ArrayCard
                        key={field.id}
                        title={`Service ${index + 1}`}
                        onRemove={() => servicesArray.remove(index)}
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <LabeledField label="Title">
                            <Input {...form.register(`servicesSection.services.${index}.title` as const)} />
                          </LabeledField>
                          <LabeledField label="Duration">
                            <Input {...form.register(`servicesSection.services.${index}.duration` as const)} />
                          </LabeledField>
                        </div>
                        <LabeledField label="Description">
                          <Textarea rows={2} {...form.register(`servicesSection.services.${index}.description` as const)} />
                        </LabeledField>
                        <div className="grid gap-4 md:grid-cols-2">
                          <LabeledField label="Price">
                            <Input {...form.register(`servicesSection.services.${index}.price` as const)} />
                          </LabeledField>
                          <LabeledField label="Service image">
                            <UploadcareUploader
                              preview={serviceImagePreview}
                              compact
                              onUpload={({ cdnUrl }) =>
                                form.setValue(`servicesSection.services.${index}.image` as const, cdnUrl, {
                                  shouldDirty: true,
                                })
                              }
                              onRemove={() =>
                                form.setValue(`servicesSection.services.${index}.image` as const, "", {
                                  shouldDirty: true,
                                })
                              }
                            />
                          </LabeledField>
                        </div>
                      </ArrayCard>
                    );
                    })}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledField label="Perks eyebrow">
                      <Input {...form.register("servicesSection.perksEyebrow")} />
                    </LabeledField>
                    <LabeledField label="Perks title">
                      <Input {...form.register("servicesSection.perksTitle")} />
                    </LabeledField>
                  </div>
                  <ArraySectionHeader
                    title="Perks list"
                    actionLabel="Add perk"
                    onAdd={() => addStringItem("servicesSection.perks")}
                  />
                  <div className="space-y-4">
                    {(servicePerks ?? []).map((_, index) => (
                      <ArrayCard
                        key={`service-perk-${index}`}
                        title={`Perk ${index + 1}`}
                        onRemove={() => removeStringItem("servicesSection.perks", index)}
                      >
                        <LabeledField>
                          <Textarea rows={2} {...form.register(`servicesSection.perks.${index}` as const)} />
                        </LabeledField>
                      </ArrayCard>
                    ))}
                  </div>
                  <SectionDescription title="Highlight card" description="Content for the amber CTA card on the right." />
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledField label="Eyebrow">
                      <Input {...form.register("servicesSection.highlightCard.eyebrow")} />
                    </LabeledField>
                    <LabeledField label="Title">
                      <Input {...form.register("servicesSection.highlightCard.title")} />
                    </LabeledField>
                  </div>
                  <LabeledField label="Description">
                    <Textarea rows={3} {...form.register("servicesSection.highlightCard.description")} />
                  </LabeledField>
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledField label="Button label">
                      <Input {...form.register("servicesSection.highlightCard.button.label")} />
                    </LabeledField>
                    <LabeledField label="Button href">
                      <Input {...form.register("servicesSection.highlightCard.button.href")} />
                    </LabeledField>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="testimonials">
                <AccordionTrigger className="text-left text-lg font-semibold">Testimonials</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <SectionDescription
                    title="Social proof"
                    description="Edit testimonial cards along with the supporting metric badges."
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledField label="Eyebrow">
                      <Input {...form.register("testimonialsSection.eyebrow")} />
                    </LabeledField>
                    <LabeledField label="Title">
                      <Input {...form.register("testimonialsSection.title")} />
                    </LabeledField>
                  </div>
                  <LabeledField label="Description">
                    <Textarea rows={3} {...form.register("testimonialsSection.description")} />
                  </LabeledField>
                  <ArraySectionHeader
                    title="Metrics"
                    actionLabel="Add metric"
                    onAdd={() =>
                      testimonialMetricsArray.append({
                        value: "",
                        label: "",
                        variant: "light",
                      })
                    }
                  />
                  <div className="space-y-4">
                    {testimonialMetricsArray.fields.map((field, index) => (
                      <ArrayCard
                        key={field.id}
                        title={`Metric ${index + 1}`}
                        onRemove={() => testimonialMetricsArray.remove(index)}
                      >
                        <div className="grid gap-4 md:grid-cols-3">
                          <LabeledField label="Value">
                            <Input {...form.register(`testimonialsSection.metrics.${index}.value` as const)} />
                          </LabeledField>
                          <LabeledField label="Label">
                            <Input {...form.register(`testimonialsSection.metrics.${index}.label` as const)} />
                          </LabeledField>
                          <Controller
                            control={form.control}
                            name={`testimonialsSection.metrics.${index}.variant` as const}
                            render={({ field }) => (
                              <LabeledField label="Variant">
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Variant" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="accent">Accent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </LabeledField>
                            )}
                          />
                        </div>
                      </ArrayCard>
                    ))}
                  </div>
                  <ArraySectionHeader
                    title="Testimonials"
                    actionLabel="Add testimonial"
                    onAdd={() =>
                      testimonialsArray.append({
                        name: "",
                        rating: 5,
                        text: "",
                      })
                    }
                  />
                  <div className="space-y-4">
                    {testimonialsArray.fields.map((field, index) => (
                      <ArrayCard
                        key={field.id}
                        title={`Testimonial ${index + 1}`}
                        onRemove={() => testimonialsArray.remove(index)}
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <LabeledField label="Guest name">
                            <Input {...form.register(`testimonialsSection.testimonials.${index}.name` as const)} />
                          </LabeledField>
                          <LabeledField label="Rating (1-5)">
                            <Input
                              type="number"
                              min={1}
                              max={5}
                              {...form.register(`testimonialsSection.testimonials.${index}.rating` as const, {
                                valueAsNumber: true,
                              })}
                            />
                          </LabeledField>
                        </div>
                        <LabeledField label="Quote">
                          <Textarea rows={3} {...form.register(`testimonialsSection.testimonials.${index}.text` as const)} />
                        </LabeledField>
                      </ArrayCard>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contact">
                <AccordionTrigger className="text-left text-lg font-semibold">Visit & concierge</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <SectionDescription
                    title="Contact & visit details"
                    description="Manage the address cards, CTA destinations, concierge highlights, and imagery."
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledField label="Eyebrow">
                      <Input {...form.register("contactSection.eyebrow")} />
                    </LabeledField>
                    <LabeledField label="Title">
                      <Input {...form.register("contactSection.title")} />
                    </LabeledField>
                  </div>
                  <LabeledField label="Description">
                    <Textarea rows={3} {...form.register("contactSection.description")} />
                  </LabeledField>
                  <ArraySectionHeader
                    title="Contact cards"
                    actionLabel="Add card"
                    onAdd={() =>
                      contactCardsArray.append({
                        title: "",
                        description: "",
                        subtext: "",
                        icon: "Phone",
                      })
                    }
                  />
                  <div className="space-y-4">
                    {contactCardsArray.fields.map((field, index) => (
                      <ArrayCard key={field.id} title={`Card ${index + 1}`} onRemove={() => contactCardsArray.remove(index)}>
                        <div className="grid gap-4 md:grid-cols-3">
                          <LabeledField label="Title">
                            <Input {...form.register(`contactSection.cards.${index}.title` as const)} />
                          </LabeledField>
                          <Controller
                            control={form.control}
                            name={`contactSection.cards.${index}.icon` as const}
                            render={({ field }) => (
                              <LabeledField label="Icon">
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select icon" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {homeIconOptions.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </LabeledField>
                            )}
                          />
                        </div>
                        <LabeledField label="Description">
                          <Textarea rows={2} {...form.register(`contactSection.cards.${index}.description` as const)} />
                        </LabeledField>
                        <LabeledField label="Subtext">
                          <Input {...form.register(`contactSection.cards.${index}.subtext` as const)} />
                        </LabeledField>
                      </ArrayCard>
                    ))}
                  </div>
                  <SectionDescription title="CTA destinations" />
                  <div className="grid gap-4 md:grid-cols-3">
                    <LabeledField label="Authenticated CTA label">
                      <Input {...form.register("contactSection.ctas.authenticated.label")} />
                    </LabeledField>
                    <LabeledField label="Authenticated CTA href">
                      <Input {...form.register("contactSection.ctas.authenticated.href")} />
                    </LabeledField>
                    <LabeledField label="Guest CTA label">
                      <Input {...form.register("contactSection.ctas.guest.label")} />
                    </LabeledField>
                    <LabeledField label="Guest CTA href">
                      <Input {...form.register("contactSection.ctas.guest.href")} />
                    </LabeledField>
                    <LabeledField label="Secondary CTA label">
                      <Input {...form.register("contactSection.ctas.secondary.label")} />
                    </LabeledField>
                    <LabeledField label="Secondary CTA href">
                      <Input {...form.register("contactSection.ctas.secondary.href")} />
                    </LabeledField>
                  </div>
                  <ArraySectionHeader
                    title="Team highlights"
                    actionLabel="Add highlight"
                    onAdd={() =>
                      contactHighlightsArray.append({
                        label: "",
                        title: "",
                        description: "",
                        icon: "Phone",
                      })
                    }
                  />
                  <div className="space-y-4">
                    {contactHighlightsArray.fields.map((field, index) => (
                      <ArrayCard
                        key={field.id}
                        title={`Highlight ${index + 1}`}
                        onRemove={() => contactHighlightsArray.remove(index)}
                      >
                        <div className="grid gap-4 md:grid-cols-3">
                          <LabeledField label="Label">
                            <Input {...form.register(`contactSection.teamHighlights.${index}.label` as const)} />
                          </LabeledField>
                          <LabeledField label="Title">
                            <Input {...form.register(`contactSection.teamHighlights.${index}.title` as const)} />
                          </LabeledField>
                          <Controller
                            control={form.control}
                            name={`contactSection.teamHighlights.${index}.icon` as const}
                            render={({ field }) => (
                              <LabeledField label="Icon">
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select icon" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {homeIconOptions.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </LabeledField>
                            )}
                          />
                        </div>
                        <LabeledField label="Description">
                          <Textarea rows={2} {...form.register(`contactSection.teamHighlights.${index}.description` as const)} />
                        </LabeledField>
                      </ArrayCard>
                    ))}
                  </div>
                  <SectionDescription title="Lounge imagery" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledField label="Lounge image" className="md:col-span-2">
                      <UploadcareUploader
                        preview={contactImagePreview}
                        onUpload={({ cdnUrl, uuid }) => {
                          form.setValue("contactSection.image.url", cdnUrl, { shouldDirty: true });
                          form.setValue("contactSection.image.uuid", uuid, { shouldDirty: true });
                        }}
                        onRemove={() => {
                          form.setValue("contactSection.image.url", "", { shouldDirty: true });
                          form.setValue("contactSection.image.uuid", undefined, { shouldDirty: true });
                        }}
                      />
                    </LabeledField>
                    <LabeledField label="Image alt text">
                      <Input {...form.register("contactSection.image.alt")} />
                    </LabeledField>
                    <LabeledField label="Caption eyebrow">
                      <Input {...form.register("contactSection.image.captionEyebrow")} />
                    </LabeledField>
                    <LabeledField label="Caption title">
                      <Input {...form.register("contactSection.image.captionTitle")} />
                    </LabeledField>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset(homeContentQuery.data ?? defaultHomeContent)}
                disabled={isSaving}
              >
                Reset changes
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save home page
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
function SectionDescription({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">{title}</p>
      {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
    </div>
  );
}

function ArraySectionHeader({ title, actionLabel, onAdd }: { title: string; actionLabel: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <Button type="button" variant="ghost" size="sm" onClick={onAdd} className="gap-2">
        <PlusCircle className="h-4 w-4" />
        {actionLabel}
      </Button>
    </div>
  );
}

function ArrayCard({
  title,
  children,
  onRemove,
}: {
  title: string;
  children: ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {onRemove && (
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function LabeledField({ label, children, className }: { label?: string; children: ReactNode; className?: string }) {
  const compose = (base: string) => (className ? `${base} ${className}` : base);

  if (!label) {
    return <div className={compose("text-sm text-gray-700")}>{children}</div>;
  }

  return (
    <label className={compose("flex flex-col gap-1 text-sm font-medium text-gray-700")}>
      <span>{label}</span>
      {children}
    </label>
  );
}
