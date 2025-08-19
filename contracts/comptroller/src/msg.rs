use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Decimal};

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum ExecuteMsg {
    RegisterMarket { asset: String, market: Addr, collateral_factor: Decimal },
    UpdateCollateralFactor { asset: String, factor: Decimal },
    EnterMarket { asset: String },
    ExitMarket { asset: String },
}

#[cw_serde]
pub enum QueryMsg {
    GetMarket { asset: String },
    GetAccountLiquidity { user: String },
}

#[cw_serde]
pub struct MarketInfo {
    pub market: Addr,
    pub collateral_factor: Decimal,
} 