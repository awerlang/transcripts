export type AgentData = {
    id: string;
    full_name: string;
    email: string;
}

export type CallAgentData = {
    agent_id: string;
    channel_no: number;
}

export type CallCustomerData = {
    full_name: string;
    channel_no: number;
}

export type CallData = {
    id: string;
    call_start_time: string;
    agent: CallAgentData[];
    customer: CallCustomerData[];
}
