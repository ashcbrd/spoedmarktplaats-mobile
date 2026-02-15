import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {reviewsApi} from '../api/endpoints/reviews';
import {showErrorAlert} from '../utils/errorHandling';

export const useReviewsForUser = (userId: string) =>
  useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn: () => reviewsApi.forUser(userId),
    enabled: !!userId,
  });

export const useReviewsForDeal = (dealId: string) =>
  useQuery({
    queryKey: ['reviews', 'deal', dealId],
    queryFn: () => reviewsApi.forDeal(dealId),
    enabled: !!dealId,
  });

export const useSubmitReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reviewsApi.submit,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({queryKey: ['reviews']});
      qc.invalidateQueries({queryKey: ['deals', vars.dealId]});
    },
    onError: e => showErrorAlert(e),
  });
};
