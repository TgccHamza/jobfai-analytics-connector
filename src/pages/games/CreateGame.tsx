
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_GAME } from "@/graphql/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  gameName: z
    .string()
    .min(3, { message: "Game name must be at least 3 characters." })
    .max(50, { message: "Game name must be less than 50 characters." }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters." })
    .optional(),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const CreateGame: React.FC = () => {
  const navigate = useNavigate();
  const [createGame, { loading }] = useMutation(CREATE_GAME, {
    onCompleted: (data) => {
      toast.success("Game created successfully");
      navigate(`/games/${data.createGame.gameId}`);
    },
    onError: (error) => {
      toast.error(`Error creating game: ${error.message}`);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameName: "",
      description: "",
      active: true,
    },
  });

  const onSubmit = (values: FormValues) => {
    createGame({
      variables: {
        input: values,
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        heading="Create New Game"
        description="Create a new game for your assessment"
      >
        <Button
          variant="outline"
          onClick={() => navigate("/games")}
          size="sm"
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Games
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Game Information</CardTitle>
          <CardDescription>
            Provide the basic information for your new game.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 max-w-2xl"
            >
              <FormField
                control={form.control}
                name="gameName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter game name..."
                        {...field}
                        autoFocus
                      />
                    </FormControl>
                    <FormDescription>
                      A short, descriptive name for your game.
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
                        placeholder="Enter game description..."
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormDescription>
                      A detailed description of the game's purpose and structure.
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
                        Set the game as active if it's ready to be used.
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

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/games")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Game
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGame;
