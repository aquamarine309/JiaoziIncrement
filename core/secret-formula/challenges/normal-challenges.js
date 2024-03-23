import { DC } from "../../constants.js";

export const normalChallenges = [
  {
    id: 1,
    description: () => $t("chall1"),
    reward: {
      description: () => `蒸笼重置时保留基于挑战完成个数的饺子`,
      effect: () => Math.pow(2, NormalChallenges.completed.length + 1) * 9,
      formatEffect: value => NormalChallenges.completed.length === 8 ? "保留所有饺子" : `每种饺子各保留${format(value / 9, 2)}个`
    }
  },
  {
    id: 2,
    description: () => $t("chall2"),
    effect: 0.225,
    reward: {
      description: () => `你可以多选一个饺子，你每秒可获得出售后饺子币的${formatPercents(0.01)}`,
      effect: () => gainedMoney().times(Time.deltaTime / 100)
    }
  },
  {
    id: 3,
    description: () => $t("chall3"),
    effect: () => Decimal.pow(10, Decimal.pow(10, Wrapper.base.minus(1.1)).times(Decimal.pow(Math.min(Wrapper.totalAmount, 404), 0.95))),
    reward: {
      description: () => "基于饺子皮获得更多的收集饺子",
      effect: () => Math.floor(Wrapper.totalAmount / 10 + 1),
      formatEffect: value => formatX(value, 2)
    }
  },
  {
    id: 4,
    description: () => $t("chall4", [format(1e21, 2), formatPow(0.82, 0, 2)]),
    effect: 0.82,
    reward: {
      description: () => `基于蒸笼次数的升级的效果变为原来的${format(1.3, 0, 1)}次方`,
      effect: 1.3
    }
  },
  {
    id: 5,
    description: () => $t("chall5", [formatPercents(0.05)]),
    effect: 0.05,
    reward: {
      description: () => `饺子皮的效果变为原来的${format(1.2, 0, 1)}倍`,
      effect: 1.2
    }
  },
  {
    id: 6,
    description: () => $t("chall6", [formatInt(1)]),
    effect: () => player.bigResetCount.min(625).pow(15).add(1),
    //625^15+1 approximate to 625^15
    cap: DC.D625P15,
    formatEffect: value => formatX(value, 2, 3),
    reward: {
      description: "解锁饺子币倍增升级"
    }
  },
  {
    id: 7,
    description: () => $t("chall7", [formatInt(1)]),
    reward: {
      description: () => `本次蒸笼的时间加成制造器的效率`,
      effect: () => Decimal.pow(Time.thisSteamer.totalSeconds, 5).clampMin(1),
      formatEffect: value => formatX(value, 2, 3)
    }
  },
  {
    id: 8,
    description: () => $t("chall8", [formatPow(0.725, 2, 2)]),
    effect: 0.725,
    reward: {
      description: () => `基于本次蒸笼中最高的饺子数量，增加纯金饺的上限`,
      effect: () => Math.pow(player.records.thisSteamer.maxJiaozi.add(1).log10(), 1.5),
      formatEffect: value => `+${format(value, 2)}`,
      cap: 3.5e7
    }
  }
]