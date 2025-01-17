/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import DMConversationItem from "./_components/DMConversationItem";
import CreateGroupDialog from "./_components/CreateGroupDialog";
import GroupConversationItem from "./_components/GroupConversationItem";

type Props = React.PropsWithChildren<{}>;

const ConversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);

  return (
    <>
      <ItemList title="Conversations" Action={<CreateGroupDialog />}>
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No conversations found.
            </p>
          ) : (
            conversations.map((conversation) => {
              return conversation.conversation.isGroup ? (
                <GroupConversationItem
                  key={conversation.conversation._id}
                  id={conversation.conversation._id}
                  name={conversation.conversation.name || ""}
                  lastMessageSender={conversation.lastMessage?.sender}
                  lastMessageContent={conversation.lastMessage?.content}
                  unseenCount={conversation.unseenCount}
                />
              ) : (
                <DMConversationItem
                  key={conversation.conversation._id}
                  id={conversation.conversation._id}
                  imageUrl={conversation.otherMember?.imageUrl || ""}
                  username={conversation.otherMember?.username || ""}
                  lastMessageSender={conversation.lastMessage?.sender}
                  lastMessageContent={conversation.lastMessage?.content}
                  unseenCount={conversation.unseenCount}
                />
              );
            })
          )
        ) : (
          <Loader2 />
        )}
      </ItemList>
      {children}
    </>
  );
};

export default ConversationsLayout;
