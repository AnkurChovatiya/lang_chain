import mysql from "mysql2/promise";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";

import { v4 as uuidv4 } from "uuid";

const dbConfig = process.env;

const config = { configurable: { thread_id: uuidv4() } };
export async function GET(req: Request) {
  //   console.log("Static Config : =====>", config);

  try {
    const url = new URL(req.url);
    const userQuestion = url.searchParams.get("question");
    // console.log("userQuestion =>", userQuestion);

    if (!userQuestion) {
      return new Response(
        JSON.stringify({ error: "Question parameter is missing" }),
        { status: 400 }
      );
    }

    const pool = mysql.createPool({
      host: dbConfig.DB_HOST,
      user: dbConfig.DB_USER,
      password: dbConfig.DB_PASS,
      database: dbConfig.DB_NAME,
    });

    // const question = "give customer names whose orders are in process with highest credit limit";
    // const question = "give me employee name to whom ankur reports";
    // const question = "how many employees are serving as sales rep";
    // const question = "give me a cancelled order";
    // const question = "give total amount received in 2004";
    const model = new ChatOpenAI({ model: "gpt-4o-mini" });
    // const data = await model.invoke(userQuestion);
    // return Response.json({
    //   message: data.content,
    // });

    // userQuestion
    // ======================   Example 1  ========================

    // const messages = [
    //   new SystemMessage("Translate the following from English into Hindi"),
    //   new HumanMessage(userQuestion),
    // ];

    // const data = await model.invoke(messages);
    // // console.log("Check data ====>", data.content);
    // return Response.json({
    //   message: data.content,
    // });

    // ======================   Example 2  ========================

    // const systemTemplate =
    //   "Translate the following from English into {language}";
    // const promptTemplate = ChatPromptTemplate.fromMessages([
    //   ["system", systemTemplate],
    //   ["user", userQuestion],
    // ]);

    // const promptValue = await promptTemplate.invoke({
    //   language: "gujrati",
    //   text: "hi!",
    // });

    // const response = await model.invoke(promptValue);
    // return Response.json({
    //   message: response.content,
    // });

    // =======================    Chat History LangGraph       ===========================================

    const callModel = async (state: typeof MessagesAnnotation.State) => {
      const response = await model.invoke(state.messages);
      return { messages: response };
    };

    // Define a new graph
    const workflow = new StateGraph(MessagesAnnotation)
      // Define the node and edge
      .addNode("model", callModel)
      .addEdge(START, "model")
      .addEdge("model", END);

    // Add memory
    const memory = new MemorySaver();
    const app = workflow.compile({ checkpointer: memory });

    const input = [
      {
        role: "user",
        content: "Hi! I'm Bob.",
      },
    ];
    const input2 = [
      {
        role: "user",
        content: "What's my name?",
      },
    ];
    console.log("Check this =====>", config);
    // const output = await app.invoke({ messages: input }, config);

    const output2 = await app.invoke({ messages: input2 }, config);
    // The output contains all messages in the state.
    // This will long the last message in the conversation.
    // console.log(output.messages[output.messages.length - 1]);
    console.log(output2.messages[output2.messages.length - 1]);

    return Response.json({ name: "Lang chain chat" });
  } catch (error) {
    console.log("Error from lang chain chat ===>", error);
    return Response.json({ name: "Lang chain chat", error: error });
  }
}
