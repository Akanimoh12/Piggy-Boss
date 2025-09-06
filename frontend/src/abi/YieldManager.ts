export const YieldManagerABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "planDays",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "suggestedAPY",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "riskScore",
        "type": "uint256"
      }
    ],
    "name": "AIOptimizationReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "planDays",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "oldAPY",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newAPY",
        "type": "uint256"
      }
    ],
    "name": "APYUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "bonusType",
        "type": "string"
      }
    ],
    "name": "BonusDistributed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalDeposits",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "averageAPY",
        "type": "uint256"
      }
    ],
    "name": "PerformanceMetricsUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "positionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "principal",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "PositionCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "RewardDistributed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "oldPool",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newPool",
        "type": "uint256"
      }
    ],
    "name": "RewardPoolUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "positionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "interest",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "YieldAccrued",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "addToRewardPool",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "aiOracle",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_positionId",
        "type": "uint256"
      }
    ],
    "name": "calculateAccruedInterest",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_positionId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_bonusType",
        "type": "string"
      }
    ],
    "name": "calculateAndDistributeBonus",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "bonusAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_planDays",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_baseAPY",
        "type": "uint256"
      }
    ],
    "name": "calculateEffectiveAPY",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "calculatePlatformHealth",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "healthScore",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "utilizationRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "avgAPY",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "compoundingFrequency",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_planDays",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_baseAPY",
        "type": "uint256"
      }
    ],
    "name": "createYieldPosition",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_users",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_amounts",
        "type": "uint256[]"
      },
      {
        "internalType": "string",
        "name": "_reason",
        "type": "string"
      }
    ],
    "name": "distributeSpecialRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "distributedRewards",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_positionId",
        "type": "uint256"
      }
    ],
    "name": "finalizePosition",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "principal",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalInterest",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_planDays",
        "type": "uint256"
      }
    ],
    "name": "getBasePlanAPY",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_planDays",
        "type": "uint256"
      }
    ],
    "name": "getCurrentAPY",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getOptimizationSuggestions",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "suggestedAPY",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "riskScore",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "confidence",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "strategy",
            "type": "string"
          }
        ],
        "internalType": "struct IYieldManager.YieldOptimization",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPerformanceMetrics",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalDeposits",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalWithdrawals",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalInterestPaid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "averageAPY",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserYieldData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "totalDeposited",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalEarned",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalWithdrawn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "transactionCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastActivity",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "preferredPlan",
            "type": "uint256"
          }
        ],
        "internalType": "struct IYieldManager.UserYieldData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserYieldRanking",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "ranking",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserYieldSummary",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalYield",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "activePositions",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pendingRewards",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "globalApyMultiplier",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "lastAccrualTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "metrics",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalDeposits",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalWithdrawals",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalInterestPaid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "averageAPY",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastUpdated",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nftRewards",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "optimizations",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "suggestedAPY",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "riskScore",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "confidence",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "strategy",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "piggyVault",
    "outputs": [
      {
        "internalType": "contract IPiggyVault",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "planMultipliers",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_planDays",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_suggestedAPY",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_riskScore",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_confidence",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_strategy",
        "type": "string"
      }
    ],
    "name": "receiveAIOptimization",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_planDays",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_baseAPY",
        "type": "uint256"
      }
    ],
    "name": "recordDeposit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_positionId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_principal",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_interest",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_bonus",
        "type": "uint256"
      }
    ],
    "name": "recordWithdrawal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reserveRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_aiOracle",
        "type": "address"
      }
    ],
    "name": "setAIOracle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_piggyVault",
        "type": "address"
      }
    ],
    "name": "setPiggyVault",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRewardPool",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "totalUserYield",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_positionId",
        "type": "uint256"
      }
    ],
    "name": "updateAccruedInterest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "updateAllUserPositions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_multiplier",
        "type": "uint256"
      }
    ],
    "name": "updateGlobalMultiplier",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_planDays",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_multiplier",
        "type": "uint256"
      }
    ],
    "name": "updatePlanMultiplier",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userCompoundedBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userPositionCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userPositions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "principal",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "accruedInterest",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "apyBasisPoints",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastUpdateTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userYieldData",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalDeposited",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalEarned",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalWithdrawn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "transactionCount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastActivity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "preferredPlan",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;