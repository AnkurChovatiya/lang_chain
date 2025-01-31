import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function GET(req: Request) {
  try {
    const model = new ChatOpenAI({ model: "gpt-4o-mini" });


    // ======================   Example 1  ========================
    
    // const messages = [
        //   new SystemMessage("Translate the following from English into Hindi"),
        //   new HumanMessage("hi!"),
        // ];
        
        // const data = await model.invoke(messages);
        // console.log("Check data ====>", data.content);
        
        
    // ======================   Example 2  ========================

    // const systemTemplate =
    //   "Translate the following from English into {language}";
    // const promptTemplate = ChatPromptTemplate.fromMessages([
    //   ["system", systemTemplate],
    //   ["user", "{text}"],
    // ]);

    // const promptValue = await promptTemplate.invoke({
    //   language: "gujrati",
    //   text: "hi!",
    // });

    // // console.log(promptValue.toChatMessages());

    // const response = await model.invoke(promptValue);
    // console.log(`${response.content}`);
    // const messages = [
    //   new SystemMessage("Translate the following from English into Italian"),
    //   new HumanMessage("hi!"),
    // ];

    // const data = await model.invoke(messages);
    // console.log("check this ====>", data);

    return Response.json({ name: "Lang chain chat" });
  } catch (error) {
    console.log("Error from lang chain chat ===>", error);
    return Response.json({ name: "Lang chain chat", error: error });
  }
}
