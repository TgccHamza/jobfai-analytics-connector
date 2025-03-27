
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation } from "@apollo/client";
import { GET_GAME_BY_ID } from "@/graphql/queries";
import { UPDATE_GAME } from "@/graphql/mutations";
import { PageHeader } from "@/components/ui/page-header";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  gameName: z.string().min(2, "Game name must be at least 2 characters").max(100),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const EditGame = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_GAME_BY_ID, {
    variables: { gameId },
    fetchPolicy: "network-only",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameName: "",
      description: "",
      active: true,
    },
  });

  // Set form values when data is loaded
  React.useEffect(() => {
    if (data?.getGameById) {
      const game = data.getGameById;
      form.reset({
        gameName: game.gameName || "",
        description: game.description || "",
        active: game.active || true,
      });
    }
  }, [data, form]);

  const [updateGame, { loading: updating }] = useMutation(UPDATE_GAME, {
    onCompleted: () => {
      toast.success("Game updated successfully");
      navigate(`/games/${gameId}`);
    },
    onError: (error) => {
      console.error("Error updating game:", error);
      toast.error("Failed to update game");
    },
  });

  const onSubmit = (values: FormValues) => {
    updateGame({
      variables: {
        input: {
          gameId,
          ...values,
        },
      },
    });
  };

  if (error) {
    toast.error("Error loading game data");
    console.error("Error loading game:", error);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link 
          to={`/games/${gameId}`} 
          className="hover:text-primary transition-colors"
        >
          {loading ? "Loading..." : data?.getGameById?.gameName}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Edit</span>
      </div>

      <PageHeader
        heading={loading ? "Loading..." : `Edit ${data?.getGameById?.gameName}`}
        description="Update game details and settings"
      />

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full max-w-[300px]" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-full max-w-[300px]" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-full max-w-[300px]" />
              <Skeleton className="h-10 w-full max-w-[150px]" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Game Details</CardTitle>
            <CardDescription>
              Edit basic information about your game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="gameName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter game name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of your assessment game
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
                          placeholder="Describe the purpose and goals of this game"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide details about what this game assesses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Indicates if this game is currently active and available for assessments
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/games/${gameId}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updating}>
                    {updating ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditGame;
