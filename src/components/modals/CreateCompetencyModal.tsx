
import React from "react";
import { useMutation } from "@apollo/client";
import { CREATE_COMPETENCY } from "@/graphql/mutations";
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
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

const formSchema = z.object({
  competenceName: z
    .string()
    .min(3, { message: "Competency name must be at least 3 characters." })
    .max(50, { message: "Competency name must be less than 50 characters." }),
  competenceKey: z
    .string()
    .min(2, { message: "Competency key must be at least 2 characters." })
    .max(20, { message: "Competency key must be less than 20 characters." })
    .regex(/^[A-Za-z0-9_]+$/, {
      message: "Key can only contain letters, numbers, and underscores.",
    }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters." })
    .optional(),
  weight: z
    .number()
    .min(0.1, { message: "Weight must be at least 0.1." })
    .max(10, { message: "Weight must be less than 10." })
    .default(1),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCompetencyModalProps {
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (competencyId: string) => void;
}

const CreateCompetencyModal: React.FC<CreateCompetencyModalProps> = ({
  gameId,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [createCompetency, { loading }] = useMutation(CREATE_COMPETENCY, {
    onCompleted: (data) => {
      toast.success("Competency created successfully");
      form.reset();
      if (onSuccess) {
        onSuccess(data.createCompetency.competenceId);
      }
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Error creating competency: ${error.message}`);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      competenceName: "",
      competenceKey: "",
      description: "",
      weight: 1,
    },
  });

  const onSubmit = (values: FormValues) => {
    createCompetency({
      variables: {
        input: {
          ...values,
          gameId,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Competency</DialogTitle>
          <DialogDescription>
            Create a new competency for this game
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="competenceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competency Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter competency name..."
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this competency.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="competenceKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competency Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., decision_making"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A unique identifier used in the game engine (letters, numbers, underscores only).
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
                      placeholder="Enter competency description..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Details about what this competency measures.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The relative importance of this competency (default: 1).
                  </FormDescription>
                  <FormMessage />
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
                    Create Competency
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

export default CreateCompetencyModal;
