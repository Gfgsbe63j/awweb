-- Saved by UniversalSynSaveInstance (Join to Copy Games) https://discord.gg/wx4ThpAsmw

local u1 = {}
local u2 = {}
function u1.Stream(p3, p4, p5) --[[Anonymous function at line 6]]
    local u6 = {}
    for _, v7 in _G.CS:GetTagged(p3) do
        p4(v7)
    end
    local v8 = _G.CS:GetInstanceAddedSignal(p3)
    table.insert(u6, v8:Connect(p4))
    if p5 then
        local v9 = _G.CS:GetInstanceRemovedSignal(p3)
        table.insert(u6, v9:Connect(p5))
    end
    return function() --[[Anonymous function at line 17]]
        --[[
        Upvalues:
            [1] = u6
        --]]
        if u6 then
            for _, v10 in u6 do
                v10:Disconnect()
            end
            u6 = nil
        end
    end
end
function u1.QuickClone(p11, p12) --[[Anonymous function at line 26]]
    local v13 = p11:Clone()
    v13.Parent = p12
    return v13
end
function u1.GetNameFromUserId(p14, p15) --[[Anonymous function at line 32]]
    --[[
    Upvalues:
        [1] = u2
    --]]
    local v16 = u2[p14]
    if v16 then
        return v16, true
    end
    repeat
        local v17, v18 = pcall(_G.PS.GetNameFromUserIdAsync, _G.PS, p14)
    until v17 or not p15
    if not v17 then
        return "N/A", false
    end
    u2[p14] = v18
    return v18, true
end
function u1.GetFirstTag(p19) --[[Anonymous function at line 48]]
    return _G.CS:GetTagged(p19)[1] or warn((("Invalid object for Tag: %*"):format(p19)))
end
function u1.GenerateGUID() --[[Anonymous function at line 56]]
    return _G.HS:GenerateGUID(false)
end
function u1.GetGroupRank(p20) --[[Anonymous function at line 61]]
    local v21, v22 = pcall(p20.GetRankInGroup, p20, shared.Constants.GROUP_ID)
    return v21 and v22 and v22 or 0
end
function u1.DisableHumanoidStates(p23) --[[Anonymous function at line 67]]
    for _, v24 in Enum.HumanoidStateType:GetEnumItems() do
        if v24 ~= Enum.HumanoidStateType.None then
            p23:SetStateEnabled(v24, false)
        end
    end
end
function u1.TableSize(p25) --[[Anonymous function at line 75]]
    local v26 = 0
    for _ in p25 do
        v26 = v26 + 1
    end
    return v26
end
function u1.TableRemove(p27, p28) --[[Anonymous function at line 81]]
    if next(p27) then
        local v29 = table.find(p27, p28)
        if v29 then
            return table.remove(p27, v29)
        end
    end
end
function u1.DeepCopy(p30, p31) --[[Anonymous function at line 88]]
    --[[
    Upvalues:
        [1] = u1
    --]]
    local v32 = p31 or {}
    for v33, v34 in pairs(p30) do
        if typeof(v34) == "table" then
            v32[v33] = {}
            u1.DeepCopy(p30[v33], v32[v33])
        else
            v32[v33] = v34
        end
    end
    return v32
end
function u1.GetRarityOrder(p35) --[[Anonymous function at line 104]]
    local v36 = shared.Rarities[p35]
    if v36 then
        return v36.Order
    else
        return warn((("Invalid rarity config for: %*"):format(p35)))
    end
end
function u1.GetZoneOrder(p37) --[[Anonymous function at line 112]]
    local v38 = shared.Zones[p37]
    if v38 then
        return v38.Order
    else
        return warn((("Invalid zone config for: %*"):format(p37)))
    end
end
function u1.GetEnemyFromDifficultAndZone(p39, p40) --[[Anonymous function at line 120]]
    local v41 = shared.Utils.GetEnemiesByZone(p39)
    return shared.Utils.GetEnemyByDifficultFrom(v41, p40)
end
function u1.GetDifficultByOrder(p42) --[[Anonymous function at line 125]]
    for v43, v44 in shared.Difficulties do
        if v44.Order == p42 then
            return v43
        end
    end
    warn((("Invalid order: %*"):format(p42)))
end
function u1.GetRarityByOrder(p45) --[[Anonymous function at line 134]]
    for v46, v47 in shared.Rarities do
        if v47.Order == p45 then
            return v46
        end
    end
    warn((("Invalid order: %*"):format(p45)))
end
function u1.GetQuestIndex(p48) --[[Anonymous function at line 143]]
    if p48.Enemy then
        return ("Enemy Defeated %*"):format(p48.Enemy)
    end
    if p48.Material then
        return ("Material Obtained %*"):format(p48.Material)
    end
    if p48.Vault then
        return ("Vault Required %*"):format(p48.Vault)
    end
end
function u1.NoYDistance(p49, p50) --[[Anonymous function at line 154]]
    local v51 = p49.X - p50.X
    local v52 = p49.Y - p50.Y
    return v51 * v51 + v52 * v52
end
function u1.GetStarBuff(p53) --[[Anonymous function at line 160]]
    local v54 = shared.Zones[p53.Zone]
    if v54 then
        local v55 = shared.Rarities[p53.Rarity]
        if v55 then
            if v54.StarBasePercentage then
                return v54.StarBasePercentage * v55.StarScale
            else
                return warn((("%* invalid percentage"):format(p53.Zone)))
            end
        else
            return warn((("Invalid rarity config: %*"):format(p53.Rarity)))
        end
    else
        return warn((("Invalid zone config: %*"):format(v54)))
    end
end
function u1.GetStarLevelScale(p56, p57) --[[Anonymous function at line 172]]
    local v58 = shared.Rarities[p56.Rarity]
    if v58 then
        if v58.StarMaxLevelScale then
            return v58.StarMaxLevelScale * (p57 / shared.Constants.STAR_LEVEL_CAP)
        else
            return warn((("Invalid scale: %*"):format(p56.Rarity)))
        end
    else
        return warn((("Invalid rarity config: %*"):format(p56.Rarity)))
    end
end
function u1.GetStarMastery(p59, p60) --[[Anonymous function at line 180]]
    --[[
    Upvalues:
        [1] = u1
    --]]
    local v61 = u1.GetStarBuff(p59)
    local v62 = shared.Utils.GetRarityOrder(p59.Rarity)
    local v63 = u1.GetStarLevel(p60, v62) - 1
    local v64 = u1.GetStarLevelScale(p59, v63) * v61
    return v61 + math.ceil(v64)
end
function u1.GetWeaponMastery(p65, p66) --[[Anonymous function at line 189]]
    if p65 and p66 then
        return p65 * (p66 + 1)
    end
end
function u1.StarRequiredExp(p67, p68) --[[Anonymous function at line 194]]
    if p67 then
        return p67 ^ 1.1 * (p67 + 1) * p68 * 10
    end
end
function u1.GetStarLevel(p69, p70) --[[Anonymous function at line 199]]
    --[[
    Upvalues:
        [1] = u1
    --]]
    if p69 then
        local v71 = 0
        local v72 = 0
        while v71 <= p69 do
            v72 = v72 + 1
            v71 = u1.StarRequiredExp(v72, p70)
        end
        return v72
    end
end
function u1.GetStarFuseExp(p73, p74, p75) --[[Anonymous function at line 213]]
    --[[
    Upvalues:
        [1] = u1
    --]]
    local v76 = u1.GetRarityOrder(p73.Rarity)
    local v77 = u1.GetStarBuff(p73)
    local v78 = v76 ^ 2 * v77 ^ 0.5
    local v79 = (p74 or 0) * 0.5
    if p75 then
        v78 = v78 * 2
    end
    return v79 + v78
end
function u1.GetYenBasedOnHealth(p80) --[[Anonymous function at line 227]]
    local v81 = 5 + (p80 / 100) ^ 0.29
    return math.ceil(v81)
end
function u1.GetPaidCurrency(p82) --[[Anonymous function at line 231]]
    local v83 = p82 * 9.5
    return math.ceil(v83)
end
function u1.WeightStarRarities(p84, p85) --[[Anonymous function at line 235]]
    local v86 = 0
    local v87 = {}
    for v88, v89 in p84 do
        local v90 = shared.Stars[v88]
        if v90 then
            local v91 = shared.Rarities[v90.Rarity].LuckWeight
            local v92 = p85 ^ 0.3
            local v93 = v89 * math.pow(v91, v92)
            v86 = v86 + v93
            table.insert(v87, {
                ["Index"] = v88,
                ["Chance"] = v93
            })
        else
            warn("Not Found: " .. v88)
        end
    end
    table.sort(v87, function(p94, p95) --[[Anonymous function at line 248]]
        if p94.Chance < p95.Chance then
            return true
        end
    end)
    return v87, v86
end
function u1.WeightedRandomItem(p96, p97) --[[Anonymous function at line 255]]
    local v98 = math.random(p97)
    local v99 = 0
    for _, v100 in ipairs(p96) do
        v99 = v99 + v100.Chance
        if v98 <= v99 then
            return v100.Index
        end
    end
end
function u1.GetPointHeight(p101, p102) --[[Anonymous function at line 267]]
    local v103 = workspace:Spherecast(p101, 2, Vector3.new(-0, -30, -0), p102)
    if v103 then
        return v103.Position
    end
end
function u1.GetPositionInBox(p104, p105) --[[Anonymous function at line 276]]
    --[[
    Upvalues:
        [1] = u1
    --]]
    local v106 = p104.CFrame
    local v107 = p104.Size
    for _ = 1, 10 do
        local v108 = math.random(-v107.X / 2, v107.X / 2)
        local v109 = math.random(-v107.Z / 2, v107.Z / 2)
        local v110 = v106 * CFrame.new(v108, v107.Y / 2, v109)
        local v111 = u1.GetPointHeight(v110.Position, p105)
        if v111 then
            return v111
        end
        task.wait()
    end
    warn("Failed to find valid position after " .. 10 .. " attempts")
    return v106.Position
end
function u1.GetPositionInCircle(p112, p113) --[[Anonymous function at line 297]]
    if not p112 then
        return warn("Not received a part")
    end
    local v114 = p112.CFrame
    local v115 = p112.Size.X / 2
    local v116 = p112.Size.Y / 2
    for _ = 1, 10 do
        local v117 = math.random() * 2 * 3.141592653589793
        local v118 = math.random()
        local v119 = math.sqrt(v118) * v115
        local v120 = v119 * math.cos(v117)
        local v121 = v119 * math.sin(v117)
        local v122 = v114 * CFrame.new(v120, v116, v121)
        local v123 = workspace:Spherecast(v122.Position, 2, Vector3.new(-0, -30, -0), p113)
        if v123 then
            return v123.Position
        end
        task.wait()
    end
    warn("Failed to find valid position after " .. 10 .. " attempts")
    return v114.Position
end
function u1.GetSpawnCFrame(p124, p125) --[[Anonymous function at line 323]]
    --[[
    Upvalues:
        [1] = u1
    --]]
    local v126 = u1.GetPositionInCircle(p124) + p125 + Vector3.new(0, 2, 0)
    return CFrame.new(v126, v126 + p124.CFrame.LookVector)
end
function u1.GetEnemyByDifficultFrom(p127, p128) --[[Anonymous function at line 328]]
    for v129, v130 in p127 do
        if v130.Difficult == p128 then
            return v129, v130
        end
    end
end
function u1.GetEnemiesByZone(p131) --[[Anonymous function at line 336]]
    local v132 = {}
    for v133, v134 in shared.Enemies do
        if v134.Zone == p131 then
            v132[v133] = v134
        end
    end
    return v132
end
local u135 = game:GetService("Debris")
function u1.CloneDebris(p136, p137) --[[Anonymous function at line 349]]
    --[[
    Upvalues:
        [1] = u135
    --]]
    local v138 = p136:Clone()
    u135:AddItem(v138, p137)
    return v138
end
function u1.Debris(p139, p140) --[[Anonymous function at line 355]]
    --[[
    Upvalues:
        [1] = u135
    --]]
    u135:AddItem(p139, p140)
end
function u1.EmitAll(p141, p142) --[[Anonymous function at line 359]]
    for _, v143 in p141:GetDescendants() do
        if v143.ClassName == "ParticleEmitter" then
            v143.Enabled = false
            v143:Emit(p142)
        end
    end
end
function u1.EnableAll(p144, p145) --[[Anonymous function at line 367]]
    for _, v146 in p144:GetDescendants() do
        if v146.ClassName == "ParticleEmitter" then
            v146.Enabled = p145
        end
    end
end
function u1.AddTrail(p147, p148) --[[Anonymous function at line 374]]
    if p147:FindFirstChild("Trail0") and p147:FindFirstChild("Trail1") then
        local v149 = p148:Clone()
        v149.Attachment0 = p147.Trail0
        v149.Attachment1 = p147.Trail1
        v149.Parent = p147
        return v149
    end
end
function u1.Bezier(p150, p151, p152, p153) --[[Anonymous function at line 385]]
    return p150:Lerp(p151, p153):Lerp(p151:Lerp(p152, p153), p153)
end
function u1.RandomOffset(p154) --[[Anonymous function at line 391]]
    local v155 = p154 or 1
    local v156 = v155 * 2
    local v157 = math.random() * v156 - v155
    local v158 = math.random() * v156 - v155
    local v159 = math.random() * v156 - v155
    return Vector3.new(v157, v158, v159)
end
function u1.RandomOffsetXYZ(p160, p161, p162) --[[Anonymous function at line 400]]
    local v163 = math.random() * (p160 * 2) - p160
    local v164 = math.random() * (p161 * 2) - p161
    local v165 = math.random() * (p162 * 2) - p162
    return Vector3.new(v163, v164, v165)
end
local u166 = table.freeze({
    "",
    "K",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "Oc",
    "No",
    "Dc",
    "Ud",
    "Dd",
    "Td",
    "Qad",
    "Qid",
    "Sxd",
    "Spd",
    "Ocd",
    "Nod",
    "Dec",
    "Und",
    "Duo",
    "Tri",
    "Qua",
    "Qui",
    "Six",
    "Sep",
    "Oct",
    "Nuo"
})
function u1.ToText(p167, p168) --[[Anonymous function at line 411]]
    --[[
    Upvalues:
        [1] = u166
    --]]
    if typeof(p167) ~= "number" then
        return "0"
    end
    if p167 == 0 then
        return "0"
    end
    if p167 == (1 / 0) or (p167 == (-1 / 0) or p167 ~= p167) then
        return "\226\136\158"
    end
    local v169 = p168 or 2
    local v170 = math.abs(p167)
    local v171 = math.log(v170, 1000)
    local v172 = math.floor(v171)
    if v172 < 0 then
        return ("%." .. v169 .. "f"):format(p167)
    end
    local v173 = u166[v172 + 1] or "e+" .. v172
    local v174 = p167 / 1000 ^ v172
    local v175 = ("%." .. v169 .. "f"):format(v174)
    if v169 > 0 then
        v175 = v175:gsub("(%.%d-)0+$", "%1"):gsub("%.$", "")
    end
    return v175 .. v173
end
u1.AnimateText = require(script.AnimateText)(u1)
function u1.GetTodayUtcTimestamp() --[[Anonymous function at line 440]]
    local v176 = os.date("!*t")
    v176.hour = 0
    v176.min = 0
    v176.sec = 0
    return os.time(v176)
end
function u1.FormatMinutes(p177) --[[Anonymous function at line 448]]
    local v178 = p177 < 0 and 0 or p177
    local v179 = v178 / 60
    local v180 = math.floor(v179)
    local v181 = v178 % 60
    local v182 = math.floor(v181)
    return string.format("%02d:%02d", v180, v182)
end
function u1.FormatCounter(p183) --[[Anonymous function at line 457]]
    local v184 = p183 % 3600 / 60
    local v185 = math.floor(v184)
    local v186 = p183 % 60
    if p183 < 3600 then
        return string.format("%02d:%02d", v185, v186)
    end
    local v187 = p183 / 3600
    local v188 = math.floor(v187)
    return string.format("%02d:%02d:%02d", v188, v185, v186)
end
function u1.FormatTimer(p189) --[[Anonymous function at line 469]]
    if p189 < 60 then
        return string.format("%.fs", p189)
    elseif p189 < 3600 then
        local v190 = p189 / 60
        local v191 = math.floor(v190)
        local v192 = p189 % 60
        if v192 == 0 then
            return string.format("%dm", v191)
        else
            return string.format("%dm %ds", v191, v192)
        end
    else
        local v193 = p189 / 3600
        local v194 = math.floor(v193)
        local v195 = p189 % 3600 / 60
        local v196 = math.floor(v195)
        if v196 == 0 then
            return string.format("%dh", v194)
        else
            return string.format("%dh %dm", v194, v196)
        end
    end
end
function u1.FormatByType(p197, p198) --[[Anonymous function at line 495]]
    --[[
    Upvalues:
        [1] = u1
    --]]
    if p197 == "BigNumber" then
        return u1.ToText(p198)
    end
    if p197 == "DataTime" then
        return u1.FormatTimer(p198)
    end
    warn((("Invalid Type: %*"):format(p197)))
end
function u1.GetTimeNow() --[[Anonymous function at line 505]]
    local v199 = game.Workspace:GetServerTimeNow()
    return v199 % 60 // 1, v199 // 60 % 60
end
function u1.NewGradient(p200, p201) --[[Anonymous function at line 513]]
    local v202 = p200:FindFirstChildOfClass("UIGradient") or Instance.new("UIGradient", p200)
    v202.Color = p201
    v202.Rotation = 60
    return v202
end
return table.freeze(u1)
