import CustomTamboProvider from "@/components/CustomTamboProvider";
import React from "react";
import session from "@/lib/middleware/session";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";

const Chat = async () => {
  const userId = await session();

  return (
    <CustomTamboProvider userId={userId!}>
      <MessageThreadFull
        userId={userId!}
        contextKey="tambo-template"
        className="border-gray-300"
      />
    </CustomTamboProvider>
  );
};

export default Chat;
