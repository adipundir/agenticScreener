import { useWriteContract, useReadContract, useAccount, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import abi from "@/lib/abi.json"
import { Address, parseEther } from 'viem';
import { toast } from "sonner";
import { useEffect } from 'react';
import { JobOpeningContract } from '@/types/types';

export const useContractInteraction = () => {
    const { address, chain, isConnected } = useAccount();
    const { data: hash, writeContract, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isConfirmed) {
            toast.success(`Transaction confirmed successfully! ${hash}`);
        } else if (error) {
            console.log('error', error);
            toast.error(`Error: ${error.message} ${hash}`);
        } else if (isConfirming) {
            toast.info(`Transaction is confirming... ${hash}`);
        }
    }, [isConfirming, isConfirmed, error, hash]);

    //Read Contract Calls

    const { data: allJobOpenings } = useReadContract({
        abi,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
        functionName: 'getUser',
        args: [address as Address],
        query: {
            enabled: !!address,
        },
        account: address
    }) as { data?: JobOpeningContract[] };

    const addJobOpening = (openingURL: string) => {
        return writeContract({
            abi,
            address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
            functionName: 'addJobListing',
            args: [openingURL],
            value: parseEther('0.001'),
        });
    };

    return {
        allJobOpenings,
        addJobOpening,
        chain,
        address,
        isConnected,
        hash
    };
};
