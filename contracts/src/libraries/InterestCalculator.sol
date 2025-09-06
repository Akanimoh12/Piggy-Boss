// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

library InterestCalculator {
    using SafeMath for uint256;
    
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_DAY = 86400;
    uint256 public constant SECONDS_PER_YEAR = 31536000;
    uint256 public constant PRECISION = 10**18;
    
    function calculateCompoundInterest(
        uint256 _principal,
        uint256 _apyBasisPoints,
        uint256 _timeElapsed,
        uint256 _totalDuration
    ) internal pure returns (uint256) {
        if (_principal == 0 || _apyBasisPoints == 0 || _timeElapsed == 0) {
            return 0;
        }
        
        uint256 timeFraction = _timeElapsed.mul(PRECISION).div(_totalDuration);
        
        uint256 apyDecimal = _apyBasisPoints.mul(PRECISION).div(BASIS_POINTS);
        
        if (_timeElapsed < 1 days) {
            uint256 interest = _principal
                .mul(apyDecimal)
                .mul(timeFraction)
                .div(PRECISION)
                .div(PRECISION);
            return interest;
        }
        
        // For longer periods, use compound interest formula
        // A = P(1 + r/n)^(nt) - P, where n = 365 (daily compounding)
        uint256 dailyRate = apyDecimal.div(365);
        uint256 compoundPeriods = _timeElapsed.div(SECONDS_PER_DAY);
        
        // Calculate (1 + r/n)^(nt) using approximation for precision
        uint256 compoundFactor = PRECISION;
        uint256 dailyFactor = PRECISION.add(dailyRate);
        
        // Use iterative multiplication for compound calculation
        for (uint256 i = 0; i < compoundPeriods && i < 365; i++) {
            compoundFactor = compoundFactor.mul(dailyFactor).div(PRECISION);
        }
        
        // Calculate final amount and subtract principal
        uint256 finalAmount = _principal.mul(compoundFactor).div(PRECISION);
        return finalAmount > _principal ? finalAmount.sub(_principal) : 0;
    }
    
    /**
     * @dev Calculate continuous compound interest using e^(rt) approximation
     * @param _principal Principal amount
     * @param _apyBasisPoints Annual Percentage Yield in basis points
     * @param _timeElapsed Time elapsed in seconds
     * @return Interest earned with continuous compounding
     */
    function calculateContinuousCompoundInterest(
        uint256 _principal,
        uint256 _apyBasisPoints,
        uint256 _timeElapsed
    ) internal pure returns (uint256) {
        if (_principal == 0 || _apyBasisPoints == 0 || _timeElapsed == 0) {
            return 0;
        }
        
        // Convert to annualized rate
        uint256 rate = _apyBasisPoints.mul(PRECISION).div(BASIS_POINTS);
        uint256 timeInYears = _timeElapsed.mul(PRECISION).div(SECONDS_PER_YEAR);
        
        // e^(rt) approximation using Taylor series: e^x ≈ 1 + x + x²/2! + x³/3! + ...
        uint256 rt = rate.mul(timeInYears).div(PRECISION);
        uint256 ert = PRECISION; // Start with 1
        
        // Add terms of Taylor series (first few terms for precision)
        ert = ert.add(rt); // + rt
        ert = ert.add(rt.mul(rt).div(PRECISION).div(2)); // + (rt)²/2!
        ert = ert.add(rt.mul(rt).div(PRECISION).mul(rt).div(PRECISION).div(6)); // + (rt)³/3!
        
        uint256 finalAmount = _principal.mul(ert).div(PRECISION);
        return finalAmount > _principal ? finalAmount.sub(_principal) : 0;
    }
    
    /**
     * @dev Calculate daily compound interest
     * @param _principal Principal amount
     * @param _apyBasisPoints Annual Percentage Yield in basis points
     * @param _days Number of days
     * @return Interest earned with daily compounding
     */
    function calculateDailyCompoundInterest(
        uint256 _principal,
        uint256 _apyBasisPoints,
        uint256 _days
    ) internal pure returns (uint256) {
        if (_principal == 0 || _apyBasisPoints == 0 || _days == 0) {
            return 0;
        }
        
        // Daily interest rate = APY / 365
        uint256 dailyRate = _apyBasisPoints.mul(PRECISION).div(365).div(BASIS_POINTS);
        
        // Calculate compound interest: A = P(1 + r)^n - P
        uint256 finalAmount = _principal;
        
        for (uint256 i = 0; i < _days; i++) {
            finalAmount = finalAmount.add(
                finalAmount.mul(dailyRate).div(PRECISION)
            );
        }
        
        return finalAmount.sub(_principal);
    }
    
    /**
     * @dev Calculate pro-rata interest for partial periods
     * @param _principal Principal amount
     * @param _apyBasisPoints Annual Percentage Yield in basis points
     * @param _startTime Start timestamp
     * @param _endTime End timestamp
     * @param _currentTime Current timestamp
     * @return Interest earned from start to current time
     */
    function calculateProRataInterest(
        uint256 _principal,
        uint256 _apyBasisPoints,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _currentTime
    ) internal pure returns (uint256) {
        require(_currentTime >= _startTime, "Current time before start");
        require(_endTime > _startTime, "Invalid time period");
        
        if (_currentTime >= _endTime) {
            _currentTime = _endTime;
        }
        
        uint256 totalDuration = _endTime.sub(_startTime);
        uint256 elapsedTime = _currentTime.sub(_startTime);
        
        return calculateCompoundInterest(_principal, _apyBasisPoints, elapsedTime, totalDuration);
    }
    
    /**
     * @dev Calculate effective APY with bonuses
     * @param _baseAPY Base APY in basis points
     * @param _bonusMultiplier Bonus multiplier in basis points (10000 = no bonus)
     * @param _loyaltyBonus Loyalty bonus in basis points
     * @return Effective APY including all bonuses
     */
    function calculateEffectiveAPY(
        uint256 _baseAPY,
        uint256 _bonusMultiplier,
        uint256 _loyaltyBonus
    ) internal pure returns (uint256) {
        uint256 effectiveAPY = _baseAPY.mul(_bonusMultiplier).div(BASIS_POINTS);
        return effectiveAPY.add(_loyaltyBonus);
    }
    
    /**
     * @dev Calculate penalty for early withdrawal
     * @param _principal Principal amount
     * @param _penaltyRate Penalty rate in basis points
     * @param _timeElapsed Time elapsed since deposit
     * @param _minimumTime Minimum time before penalty reduction
     * @return Penalty amount
     */
    function calculateEarlyWithdrawalPenalty(
        uint256 _principal,
        uint256 _penaltyRate,
        uint256 _timeElapsed,
        uint256 _minimumTime
    ) internal pure returns (uint256) {
        // Full penalty if withdrawn before minimum time
        if (_timeElapsed < _minimumTime) {
            return _principal.mul(_penaltyRate).div(BASIS_POINTS);
        }
        
        // Reduced penalty based on time elapsed
        uint256 penaltyReduction = _timeElapsed.mul(_penaltyRate).div(_minimumTime.mul(2));
        uint256 adjustedPenalty = _penaltyRate > penaltyReduction 
            ? _penaltyRate.sub(penaltyReduction) 
            : 0;
        
        return _principal.mul(adjustedPenalty).div(BASIS_POINTS);
    }
    
    /**
     * @dev Calculate maturity bonus
     * @param _principal Principal amount
     * @param _interestEarned Interest earned during the period
     * @param _bonusRate Bonus rate in basis points
     * @return Bonus amount
     */
    function calculateMaturityBonus(
        uint256 _principal,
        uint256 _interestEarned,
        uint256 _bonusRate
    ) internal pure returns (uint256) {
        // Bonus calculated on principal + interest
        uint256 totalBase = _principal.add(_interestEarned);
        return totalBase.mul(_bonusRate).div(BASIS_POINTS);
    }
    
    /**
     * @dev Calculate APY required to reach a target amount
     * @param _principal Principal amount
     * @param _targetAmount Target amount to reach
     * @param _durationDays Duration in days
     * @return Required APY in basis points
     */
    function calculateRequiredAPY(
        uint256 _principal,
        uint256 _targetAmount,
        uint256 _durationDays
    ) internal pure returns (uint256) {
        require(_targetAmount > _principal, "Target must be greater than principal");
        require(_durationDays > 0, "Duration must be positive");
        
        uint256 targetInterest = _targetAmount.sub(_principal);
        uint256 annualizedInterest = targetInterest.mul(365).div(_durationDays);
        
        return annualizedInterest.mul(BASIS_POINTS).div(_principal);
    }
    
    /**
     * @dev Calculate time required to reach target with given APY
     * @param _principal Principal amount
     * @param _targetAmount Target amount to reach
     * @param _apyBasisPoints APY in basis points
     * @return Time required in days
     */
    function calculateTimeToTarget(
        uint256 _principal,
        uint256 _targetAmount,
        uint256 _apyBasisPoints
    ) internal pure returns (uint256) {
        require(_targetAmount > _principal, "Target must be greater than principal");
        require(_apyBasisPoints > 0, "APY must be positive");
        
        uint256 targetInterest = _targetAmount.sub(_principal);
        uint256 annualInterest = _principal.mul(_apyBasisPoints).div(BASIS_POINTS);
        
        return targetInterest.mul(365).div(annualInterest);
    }
    
    /**
     * @dev Calculate optimal savings plan for user goals
     * @param _principal Principal amount
     * @param _targetAmount Target amount
     * @param _maxDuration Maximum duration in days
     * @param _availableAPYs Array of available APY rates
     * @param _planDurations Array of plan durations corresponding to APYs
     * @return bestPlanIndex Index of the best plan
     * @return projectedAmount Amount that will be earned with the best plan
     */
    function calculateOptimalPlan(
        uint256 _principal,
        uint256 _targetAmount,
        uint256 _maxDuration,
        uint256[] memory _availableAPYs,
        uint256[] memory _planDurations
    ) internal pure returns (uint256 bestPlanIndex, uint256 projectedAmount) {
        require(_availableAPYs.length == _planDurations.length, "Arrays length mismatch");
        
        uint256 bestAmount = 0;
        bestPlanIndex = 0;
        
        for (uint256 i = 0; i < _availableAPYs.length; i++) {
            if (_planDurations[i] <= _maxDuration) {
                uint256 interest = calculateCompoundInterest(
                    _principal,
                    _availableAPYs[i],
                    _planDurations[i].mul(SECONDS_PER_DAY),
                    _planDurations[i].mul(SECONDS_PER_DAY)
                );
                
                uint256 finalAmount = _principal.add(interest);
                
                if (finalAmount >= _targetAmount && finalAmount > bestAmount) {
                    bestAmount = finalAmount;
                    bestPlanIndex = i;
                }
            }
        }
        
        projectedAmount = bestAmount;
    }
    
    /**
     * @dev Validate APY rate is within reasonable bounds
     * @param _apyBasisPoints APY in basis points
     * @return isValid Whether the APY is valid
     */
    function validateAPY(uint256 _apyBasisPoints) internal pure returns (bool isValid) {
        // APY should be between 0.1% and 100% (10 basis points to 10,000 basis points)
        return _apyBasisPoints >= 10 && _apyBasisPoints <= 10000;
    }
    
    /**
     * @dev Convert percentage to basis points
     * @param _percentage Percentage value (e.g., 5 for 5%)
     * @return Basis points (e.g., 500 for 5%)
     */
    function percentageToBasisPoints(uint256 _percentage) internal pure returns (uint256) {
        return _percentage.mul(100);
    }
    
    /**
     * @dev Convert basis points to percentage
     * @param _basisPoints Basis points value
     * @return Percentage value
     */
    function basisPointsToPercentage(uint256 _basisPoints) internal pure returns (uint256) {
        return _basisPoints.div(100);
    }
    
    /**
     * @dev Calculate yield with dynamic compounding frequency
     * @param _principal Principal amount
     * @param _apyBasisPoints Annual Percentage Yield in basis points
     * @param _timeElapsed Time elapsed in seconds
     * @param _compoundingFrequency Compounding frequency in seconds (e.g., 86400 for daily)
     * @return Interest earned with specified compounding frequency
     */
    function calculateDynamicCompoundInterest(
        uint256 _principal,
        uint256 _apyBasisPoints,
        uint256 _timeElapsed,
        uint256 _compoundingFrequency
    ) internal pure returns (uint256) {
        if (_principal == 0 || _apyBasisPoints == 0 || _timeElapsed == 0) {
            return 0;
        }
        
        uint256 periodsPerYear = SECONDS_PER_YEAR.div(_compoundingFrequency);
        uint256 periodsPassed = _timeElapsed.div(_compoundingFrequency);
        
        // Convert APY to period rate
        uint256 periodRate = _apyBasisPoints.mul(PRECISION).div(BASIS_POINTS).div(periodsPerYear);
        
        // Calculate compound factor
        uint256 compoundFactor = PRECISION;
        uint256 onePlusPeriodRate = PRECISION.add(periodRate);
        
        for (uint256 i = 0; i < periodsPassed && i < periodsPerYear; i++) {
            compoundFactor = compoundFactor.mul(onePlusPeriodRate).div(PRECISION);
        }
        
        uint256 finalAmount = _principal.mul(compoundFactor).div(PRECISION);
        return finalAmount > _principal ? finalAmount.sub(_principal) : 0;
    }
    
    /**
     * @dev Calculate APY with bonus multipliers and loyalty rewards
     * @param _baseAPY Base APY in basis points
     * @param _loyaltyTier User's loyalty tier (1-5)
     * @param _planDuration Plan duration in days
     * @param _totalSaved Total amount saved by user
     * @return Enhanced APY with all bonuses applied
     */
    function calculateEnhancedAPY(
        uint256 _baseAPY,
        uint256 _loyaltyTier,
        uint256 _planDuration,
        uint256 _totalSaved
    ) internal pure returns (uint256) {
        uint256 enhancedAPY = _baseAPY;
        
        // Loyalty tier bonus (0.5% per tier)
        if (_loyaltyTier > 0) {
            uint256 loyaltyBonus = _loyaltyTier.mul(50); // 50 basis points per tier
            enhancedAPY = enhancedAPY.add(loyaltyBonus);
        }
        
        // Duration bonus (longer plans get better rates)
        if (_planDuration >= 90) {
            enhancedAPY = enhancedAPY.add(200); // +2% for 90+ days
        } else if (_planDuration >= 30) {
            enhancedAPY = enhancedAPY.add(100); // +1% for 30+ days
        } else if (_planDuration >= 14) {
            enhancedAPY = enhancedAPY.add(50); // +0.5% for 14+ days
        }
        
        // High saver bonus (for users with significant savings)
        if (_totalSaved >= 10000 * PRECISION) { // 10,000+ USDT
            enhancedAPY = enhancedAPY.add(300); // +3% bonus
        } else if (_totalSaved >= 1000 * PRECISION) { // 1,000+ USDT
            enhancedAPY = enhancedAPY.add(150); // +1.5% bonus
        } else if (_totalSaved >= 100 * PRECISION) { // 100+ USDT
            enhancedAPY = enhancedAPY.add(75); // +0.75% bonus
        }
        
        return enhancedAPY;
    }
    
    /**
     * @dev Calculate real-time yield accrual with gas optimization
     * @param _lastBalance Last recorded balance (principal + accrued interest)
     * @param _apyBasisPoints APY in basis points
     * @param _secondsElapsed Seconds since last calculation
     * @return newInterest Newly accrued interest
     */
    function calculateRealTimeAccrual(
        uint256 _lastBalance,
        uint256 _apyBasisPoints,
        uint256 _secondsElapsed
    ) internal pure returns (uint256 newInterest) {
        if (_lastBalance == 0 || _apyBasisPoints == 0 || _secondsElapsed == 0) {
            return 0;
        }
        
        // For very small time periods, use simple interest to save gas
        if (_secondsElapsed < 3600) { // Less than 1 hour
            newInterest = _lastBalance
                .mul(_apyBasisPoints)
                .mul(_secondsElapsed)
                .div(BASIS_POINTS)
                .div(SECONDS_PER_YEAR);
        } else {
            // Use compound interest for longer periods
            uint256 dailyRate = _apyBasisPoints.mul(PRECISION).div(BASIS_POINTS).div(365);
            uint256 daysPassed = _secondsElapsed.div(SECONDS_PER_DAY);
            
            uint256 compoundFactor = PRECISION;
            uint256 dailyFactor = PRECISION.add(dailyRate);
            
            // Limit iterations for gas efficiency
            uint256 maxIterations = daysPassed > 30 ? 30 : daysPassed;
            
            for (uint256 i = 0; i < maxIterations; i++) {
                compoundFactor = compoundFactor.mul(dailyFactor).div(PRECISION);
            }
            
            // If more than 30 days, approximate the remaining compound effect
            if (daysPassed > 30) {
                uint256 remainingDays = daysPassed.sub(30);
                uint256 remainingFactor = PRECISION.add(dailyRate.mul(remainingDays));
                compoundFactor = compoundFactor.mul(remainingFactor).div(PRECISION);
            }
            
            uint256 newBalance = _lastBalance.mul(compoundFactor).div(PRECISION);
            newInterest = newBalance > _lastBalance ? newBalance.sub(_lastBalance) : 0;
        }
        
        return newInterest;
    }
    
    /**
     * @dev Calculate optimal rebalancing threshold for yield optimization
     * @param _currentAPY Current APY in basis points
     * @param _alternativeAPY Alternative APY in basis points
     * @param _principalAmount Principal amount
     * @param _remainingDays Remaining days in current plan
     * @param _switchingCost Cost of switching plans
     * @return shouldRebalance Whether rebalancing is profitable
     * @return expectedGain Expected gain from rebalancing
     */
    function calculateRebalancingBenefit(
        uint256 _currentAPY,
        uint256 _alternativeAPY,
        uint256 _principalAmount,
        uint256 _remainingDays,
        uint256 _switchingCost
    ) internal pure returns (bool shouldRebalance, uint256 expectedGain) {
        if (_alternativeAPY <= _currentAPY) {
            return (false, 0);
        }
        
        uint256 currentProjectedEarnings = calculateCompoundInterest(
            _principalAmount,
            _currentAPY,
            _remainingDays.mul(SECONDS_PER_DAY),
            _remainingDays.mul(SECONDS_PER_DAY)
        );
        
        uint256 alternativeProjectedEarnings = calculateCompoundInterest(
            _principalAmount,
            _alternativeAPY,
            _remainingDays.mul(SECONDS_PER_DAY),
            _remainingDays.mul(SECONDS_PER_DAY)
        );
        
        if (alternativeProjectedEarnings > currentProjectedEarnings.add(_switchingCost)) {
            expectedGain = alternativeProjectedEarnings.sub(currentProjectedEarnings).sub(_switchingCost);
            shouldRebalance = true;
        } else {
            shouldRebalance = false;
            expectedGain = 0;
        }
        
        return (shouldRebalance, expectedGain);
    }
}
