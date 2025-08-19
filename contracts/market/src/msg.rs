use cosmwasm_schema::cw_serde;
use cosmwasm_std::Uint128;

#[cw_serde]
pub struct InstantiateMsg {
    pub asset: String,
    pub underlying_denom: String,
}

#[cw_serde]
pub enum ExecuteMsg {
    Deposit { amount: Uint128 },
    Withdraw { amount: Uint128 },
    Borrow { amount: Uint128 },
    Repay { amount: Uint128 },
}

#[cw_serde]
pub enum QueryMsg {
    GetBalances { user: String },
} 