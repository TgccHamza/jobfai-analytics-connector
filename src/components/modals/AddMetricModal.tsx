
import React from "react";
import { useMutation } from "@apollo/client";
import { ADD_METRIC_TO_COMPETENCY } from "@/graphql/mutations";
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
import { Save, X, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const metricFormSchema = z.object({
  metricName: z
    .string()
    .min(3, { message: "Metric name must be at least 3 characters." })
    .max(50, { message: "Metric name must be less than 50 characters." }),
  metricKey: z
    .string()
    .min(2, { message: "Metric key must be at least 2 characters." })
    .max(20, { message: "Metric key must be less than 20 characters." })
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

const parameterFormSchema = z.object({
  paramName: z
    .string()
    .min(2, { message: "Parameter name must be at least 2 characters." })
    .max(50, { message: "Parameter name must be less than 50 characters." }),
  paramKey: z
    .string()
    .min(2, { message: "Parameter key must be at least 2 characters." })
    .max(20, { message: "Parameter key must be less than 20 characters." })
    .regex(/^[A-Za-z0-9_]+$/, {
      message: "Key can only contain letters, numbers, and underscores.",
    }),
  paramValue: z.string().min(1, { message: "Parameter value is required." }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters." })
    .optional(),
});

type MetricFormValues = z.infer<typeof metricFormSchema>;
type ParameterFormValues = z.infer<typeof parameterFormSchema>;

interface AddMetricModalProps {
  gameId: string;
  competencyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddMetricModal: React.FC<AddMetricModalProps> = ({
  gameId,
  competencyId,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [parameters, setParameters] = React.useState<ParameterFormValues[]>([]);
  const [isParameterSheetOpen, setIsParameterSheetOpen] = React.useState(false);

  const [addMetric, { loading }] = useMutation(ADD_METRIC_TO_COMPETENCY, {
    onCompleted: () => {
      toast.success("Metric added successfully");
      form.reset();
      setParameters([]);
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Error adding metric: ${error.message}`);
    },
  });

  const form = useForm<MetricFormValues>({
    resolver: zodResolver(metricFormSchema),
    defaultValues: {
      metricName: "",
      metricKey: "",
      description: "",
      weight: 1,
    },
  });

  const parameterForm = useForm<ParameterFormValues>({
    resolver: zodResolver(parameterFormSchema),
    defaultValues: {
      paramName: "",
      paramKey: "",
      paramValue: "",
      description: "",
    },
  });

  const onSubmit = (values: MetricFormValues) => {
    addMetric({
      variables: {
        input: {
          ...values,
          gameId,
          competencyId,
          parameters: parameters.map(param => ({
            paramName: param.paramName,
            paramKey: param.paramKey,
            paramValue: param.paramValue,
            description: param.description,
          })),
        },
      },
    });
  };

  const onAddParameter = (values: ParameterFormValues) => {
    setParameters([...parameters, values]);
    parameterForm.reset();
    setIsParameterSheetOpen(false);
    toast.success("Parameter added to metric");
  };

  const removeParameter = (index: number) => {
    const newParameters = [...parameters];
    newParameters.splice(index, 1);
    setParameters(newParameters);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Metric</DialogTitle>
          <DialogDescription>
            Add a new metric to this competency
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="metricName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter metric name..."
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this metric.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metricKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., time_spent"
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
                      placeholder="Enter metric description..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Details about what this metric measures.
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
                    The relative importance of this metric (default: 1).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Parameters</h3>
                <Sheet open={isParameterSheetOpen} onOpenChange={setIsParameterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Parameter
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Add Parameter</SheetTitle>
                      <SheetDescription>
                        Add a parameter to this metric
                      </SheetDescription>
                    </SheetHeader>
                    <Form {...parameterForm}>
                      <form onSubmit={parameterForm.handleSubmit(onAddParameter)} className="space-y-6 mt-6">
                        <FormField
                          control={parameterForm.control}
                          name="paramName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Parameter Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter parameter name..."
                                  {...field}
                                  autoFocus
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={parameterForm.control}
                          name="paramKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Parameter Key</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., max_time"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={parameterForm.control}
                          name="paramValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Parameter Value</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 60"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={parameterForm.control}
                          name="description"
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <SheetFooter>
                          <Button type="submit">Add Parameter</Button>
                        </SheetFooter>
                      </form>
                    </Form>
                  </SheetContent>
                </Sheet>
              </div>
              
              {parameters.length > 0 ? (
                <div className="border rounded-md divide-y">
                  {parameters.map((param, index) => (
                    <div key={index} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{param.paramName}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span className="font-mono">{param.paramKey}</span>
                          <span>|</span>
                          <span>Value: {param.paramValue}</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParameter(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md p-4 text-center text-sm text-muted-foreground">
                  No parameters added yet
                </div>
              )}
            </div>
            
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
                    Add Metric
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

export default AddMetricModal;
