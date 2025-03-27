
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_CONSTANT } from "@/graphql/mutations";
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

const constantFormSchema = z.object({
  constKey: z.string().min(2, "Constant key must be at least 2 characters"),
  constName: z.string().min(2, "Constant name must be at least 2 characters"),
  constValue: z.coerce.number(),
  constDescription: z.string().optional(),
});

type ConstantFormValues = z.infer<typeof constantFormSchema>;

const CreateConstant = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: gameData } = useQuery(GET_GAME_BY_ID, {
    variables: { gameId },
  });

  const [createConstant] = useMutation(CREATE_CONSTANT, {
    onCompleted: () => {
      toast.success("Constant created successfully");
      navigate(`/games/${gameId}/constants`);
    },
    onError: (error) => {
      toast.error(`Failed to create constant: ${error.message}`);
      console.error("Create constant error:", error);
      setIsSubmitting(false);
    },
  });

  const form = useForm<ConstantFormValues>({
    resolver: zodResolver(constantFormSchema),
    defaultValues: {
      constKey: "",
      constName: "",
      constValue: 0,
      constDescription: "",
    },
  });

  const onSubmit = async (data: ConstantFormValues) => {
    setIsSubmitting(true);
    
    try {
      await createConstant({
        variables: {
          input: {
            gameId,
            constKey: data.constKey,
            constName: data.constName,
            constValue: data.constValue,
            constDescription: data.constDescription,
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
        <Link to={`/games/${gameId}/constants`} className="hover:text-primary transition-colors">
          Constants
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">New Constant</span>
      </div>

      <PageHeader
        heading="Create New Constant"
        description="Add a constant value that can be used in formulas"
      />

      <Card>
        <CardHeader>
          <CardTitle>Constant Information</CardTitle>
          <CardDescription>
            Define a reusable value for calculations
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="constName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Constant Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter constant name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The display name for this constant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="constKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Constant Key*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter constant key" {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique identifier for reference in formulas (e.g., "MAX_SCORE")
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="constValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Constant Value*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Enter value" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The numerical value of this constant
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="constDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter description" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Explain what this constant represents and how it should be used
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
                onClick={() => navigate(`/games/${gameId}/constants`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Constant"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateConstant;
