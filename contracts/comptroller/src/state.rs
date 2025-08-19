use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Decimal};
use cw_storage_plus::{Map};

#[cw_serde]
pub struct Market {
    pub market: Addr,
    pub collateral_factor: Decimal,
}

pub const MARKETS: Map<&str, Market> = Map::new("markets");
pub const USER_MARKETS: Map<(&Addr, &str), bool> = Map::new("user_markets"); 