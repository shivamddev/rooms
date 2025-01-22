"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Plus, Smile } from "lucide-react";
import qs from "query-string";
import axios from "axios";
import { useModalStore } from "@/hooks/useModalStore";
interface ChatInputProps {
  apiUrl: string;
  name: string;
  Query: Record<string, any>;
  type: "channel" | "conversation";
}

const formSchema = z.object({
  content: z.string().min(1),
});
type FormValues = z.infer<typeof formSchema>;
const ChatInput = ({ apiUrl, name, Query, type }: ChatInputProps) => {
  const { onOpen } = useModalStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (value: FormValues) => {
    try {
      console.log(`values=`, value);
      const url = qs.stringifyUrl({
        url: apiUrl,
        query: Query,
      });
      const request = await axios.post(url, value);
      console.log(`request==`, request);
    } catch (e) {
      console.log(`error in onSubmit form - chat input==`, e);
    } finally {
      form.reset();
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="relative p-4 pb-6">
                    <button
                      type="button"
                      onClick={() => onOpen("messageFile", { apiUrl, query: Query })}
                      className={`absolute top-7 left-8 size-[24px] bg-zinc-500 dark:bg-zinc-400 
                    hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center`}
                    >
                      <Plus className="text-white dark:text-[#313338]" />
                    </button>
                    <Input
                      disabled={isLoading}
                      className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                      placeholder={`Message ${
                        type === "conversation" ? name : "#" + name
                      }`}
                      {...field}
                    />
                    <div className="absolute top-7 right-8">
                      <Smile className="size-4 text-zinc-500 dark:text-zinc-400" />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
