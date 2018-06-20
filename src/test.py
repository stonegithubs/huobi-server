import math
minPrice = 3000
currentPrice = 9000
buyCount = 50
money = 10000 / 6.4
lastMoney = money * 0.4
sum = 10
for index in range(buyCount):
    price = currentPrice - (index * (currentPrice - minPrice) / buyCount)
    sum = sum + (money) / buyCount
    print(
        'price:' + str(price),
        '$:' + str(sum),
        )

# 6200 100
# 6100 200
# 6000 300
# 5900 400
# 5800 500
# 5700 600
# 5600 700
# 5500 800
# 5400 900
# 5300 1000
# 5200 1100
# 5100 1200