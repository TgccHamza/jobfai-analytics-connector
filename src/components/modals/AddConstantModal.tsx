
import React from "react";
import { useMutation } from "@apollo/client";
import { ADD_CONSTANT_PARAMETER } from "@/graphql/mutations";
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
  constName: z
    .string()
    .min(2, { message: "Constant name must be at least 2 characters." })
    .max(50, { message: "Constant name must be less than 50 characters." }),
  constKey: z
    .string()
    .min(2, { message: "Constant key must be at least 2 characters." })
    .max(20, { message: "Constant key must be less than 20 characters." })
    .regex(/^[A-Za-z0-9_]+$/, {
      message: "Key can only contain letters, numbers, and underscores.",
    }),
  constValue: z.string().min(1, { message: "Constant value is required." }),
  constDescription: z
    .string()
    .max(500, { message: "Description must be less than 500 characters." })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddConstantModalProps {
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddConstantModal: React.FC<AddConstantModalProps> = ({
  gameId,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [addConstant, { loading }] = useMutation(ADD_CONSTANT_PARAMETER, {
    onCompleted: () => {
      toast.success("Constant parameter added successfully");
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Error adding constant: ${error.message}`);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      constName: "",
      constKey: "",
      constValue: "",
      constDescription: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    addConstant({
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Constant Parameter</DialogTitle>
          <DialogDescription>
            Add a constant parameter for game calculations
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="constName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Constant Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter constant name..."
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this constant.
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
                  <FormLabel>Constant Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., MAX_SCORE"
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
              name="constValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 100"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The value of this constant parameter.
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
                      placeholder="Enter description..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Details about what this constant is used for.
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
                  "Adding..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Add Constant
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

export default AddConstantModal;
