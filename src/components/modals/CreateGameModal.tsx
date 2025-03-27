
import React from "react";
import { useMutation } from "@apollo/client";
import { CREATE_GAME } from "@/graphql/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

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

interface CreateGameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (gameId: string) => void;
}

const CreateGameModal: React.FC<CreateGameModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [createGame, { loading }] = useMutation(CREATE_GAME, {
    onCompleted: (data) => {
      toast.success("Game created successfully");
      form.reset();
      if (onSuccess) {
        onSuccess(data.createGame.gameId);
      }
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Game</DialogTitle>
          <DialogDescription>
            Create a new game for your assessment
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Game
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
