-- formula to calculate how much mastery needed for next rank

return {
    ["MAX"] = 36,
    ["GetRequirement"] = function(p1) --[[Anonymous function at line 8]]
        if p1 then
            return p1 == 0 and 30000 or 30000 * 8.4 ^ p1
        end
    end,
    ["GetBuff"] = function(p2) --[[Anonymous function at line 15]]
        if p2 then
            return p2 == 0 and 0 or 100 * 2 ^ (p2 - 1)
        end
    end
}
