
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_STAGE } from "@/graphql/mutations";
import { GET_GAME_BY_ID } from "@/graphql/queries";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const stageFormSchema = z.object({
  stageKey: z.string().min(2, "Stage key must be at least 2 characters"),
  stageName: z.string().min(2, "Stage name must be at least 2 characters"),
  stageOrder: z.coerce.number().min(1, "Stage order must be at least 1"),
  benchmark: z.coerce.number().optional(),
  optimalTime: z.coerce.number().optional(),
  description: z.string().optional(),
});

type StageFormValues = z.infer<typeof stageFormSchema>;

const CreateStage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: gameData } = useQuery(GET_GAME_BY_ID, {
    variables: { gameId },
  });

  const [createStage] = useMutation(CREATE_STAGE, {
    onCompleted: (data) => {
      toast.success("Stage created successfully");
      navigate(`/games/${gameId}/stages/${data.createStage.stageId}`);
    },
    onError: (error) => {
      toast.error(`Failed to create stage: ${error.message}`);
      console.error("Create stage error:", error);
      setIsSubmitting(false);
    },
  });

  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageFormSchema),
    defaultValues: {
      stageKey: "",
      stageName: "",
      stageOrder: 1,
      benchmark: undefined,
      optimalTime: undefined,
      description: "",
    },
  });

  const onSubmit = async (data: StageFormValues) => {
    setIsSubmitting(true);
    
    try {
      await createStage({
        variables: {
          input: {
            gameId,
            stageKey: data.stageKey,
            stageName: data.stageName,
            stageOrder: data.stageOrder,
            benchmark: data.benchmark,
            optimalTime: data.optimalTime,
            description: data.description,
          },
        },
      });
    } catch (error) {
      // Error is handled in the mutation onError callback
      console.error("Form submission error:", error);
    }
  };

  const game = gameData?.getGameById;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/games/${gameId}`} className="hover:text-primary transition-colors">
          {game?.gameName || "Game"}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/games/${gameId}/stages`} className="hover:text-primary transition-colors">
          Stages
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">New Stage</span>
      </div>

      <PageHeader
        heading="Create New Stage"
        description="Add a new stage to the game"
      />

      <Card>
        <CardHeader>
          <CardTitle>Stage Information</CardTitle>
          <CardDescription>
            Enter the details for the new stage
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stageName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter stage name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The display name for this stage
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stageKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage Key*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter stage key" {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique identifier for this stage (e.g., "level_1")
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="stageOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage Order*</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        The order of this stage in the game sequence
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
                      <FormLabel>Benchmark Score</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="Optional" 
                          {...field} 
                          value={field.value || ""} 
                        />
                      </FormControl>
                      <FormDescription>
                        Target performance score
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="optimalTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Optimal Time (seconds)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Optional" 
                          {...field} 
                          value={field.value || ""} 
                        />
                      </FormControl>
                      <FormDescription>
                        Target completion time
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter stage description" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed information about this stage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/games/${gameId}/stages`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Stage"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateStage;
