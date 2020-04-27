import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (a, transaction) => {
        switch (transaction.type) {
          case 'income':
            a.income += Number(transaction.value);
            break;

          case 'outcome':
            a.outcome += Number(transaction.value);
            break;

          default:
            break;
        }

        return a;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income: income, outcome: outcome, total: total };
  }
}

export default TransactionsRepository;
