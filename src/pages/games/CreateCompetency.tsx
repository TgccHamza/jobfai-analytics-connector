
import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_GAME_BY_ID, GET_COMPETENCIES_BY_GAME } from "@/graphql/queries";
import { CREATE_COMPETENCE } from "@/graphql/mutations";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema with Zod validation
const competencySchema = z.object({
  competenceName: z.string().min(1, "Competency name is required"),
  competenceKey: z.string().min(1, "Competency key is required"),
  description: z.string().optional(),
  weight: z.coerce.number().min(0.1, "Weight must be at least 0.1").default(1.0),
  benchmark: z.string().optional(),
});

type CompetencyFormValues = z.infer<typeof competencySchema>;

const CreateCompetency = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  
  const { loading, error, data } = useQuery(GET_GAME_BY_ID, {
    variables: { gameId }
  });

  // Define the createCompetence mutation
  const [createCompetence, { loading: createLoading }] = useMutation(CREATE_COMPETENCE, {
    onCompleted: (data) => {
      toast.success("Competency created successfully!");
      navigate(`/games/${gameId}/competencies`);
    },
    onError: (error) => {
      console.error("Error creating competency:", error);
      toast.error(`Failed to create competency: ${error.message}`);
    },
    refetchQueries: [
      { 
        query: GET_COMPETENCIES_BY_GAME, 
        variables: { gameId } 
      }
    ]
  });

  const game = data?.getGameById;

  // Initialize the form with react-hook-form
  const form = useForm<CompetencyFormValues>({
    resolver: zodResolver(competencySchema),
    defaultValues: {
      competenceName: "",
      competenceKey: "",
      description: "",
      weight: 1.0,
      benchmark: "",
    },
  });

  const handleSubmit = (values: CompetencyFormValues) => {
    createCompetence({
      variables: {
        input: {
          gameId,
          competenceName: values.competenceName,
          competenceKey: values.competenceKey,
          description: values.description || "",
          weight: parseFloat(values.weight.toString()),
          benchmark: values.benchmark ? parseFloat(values.benchmark) : null,
        }
      }
    });
  };

  const handleCancel = () => {
    navigate(`/games/${gameId}/competencies`);
  };

  if (error) {
    console.error("Error loading game data:", error);
    return <div>Error loading game data. Please try again.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link to="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/games/${gameId}`} className="hover:text-primary transition-colors">
          {loading ? "Loading..." : game?.gameName}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/games/${gameId}/competencies`} className="hover:text-primary transition-colors">
          Competencies
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">New Competency</span>
      </div>

      <PageHeader
        heading="Create New Competency"
        description="Add a new competency to evaluate players in this game"
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Competency Details</CardTitle>
          <CardDescription>
            Define the new competency and its evaluation parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="competenceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competency Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Problem Solving"
                          disabled={createLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="competenceKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competency Key *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., problem_solving"
                          disabled={createLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Unique identifier for this competency (no spaces, use underscores)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe what this competency measures and how it's evaluated"
                          rows={4}
                          disabled={createLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of this competency
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="10"
                            placeholder="1.0"
                            disabled={createLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Relative importance of this competency (default: 1.0)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="benchmark"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benchmark</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., 75"
                            disabled={createLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Target performance level for this competency
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={createLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createLoading}
                >
                  {createLoading ? "Creating..." : "Create Competency"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCompetency;
