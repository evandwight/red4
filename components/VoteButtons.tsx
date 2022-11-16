import { VoteDirection } from '@prisma/client';
import { API_VOTE } from "lib/api/paths";
import { notAuthorizedToSignIn } from 'lib/utils';
import { useEffect, useState } from 'react';
import DownArrow from 'svg/arrow-down-line.svg';
import UpArrow from 'svg/arrow-up-line.svg';

export function sendVote(thing_id, direction, setVote) {
    API_VOTE.post({thing_id, direction})
        .catch(notAuthorizedToSignIn);
    setVote(direction);
}

export function VoteButtons({ thing, initialVotes }) {
    const {UP, DOWN, NONE} = VoteDirection;
    const [vote, setVote] = useState<VoteDirection>(NONE);
    useEffect(() => {
        if (initialVotes) {
            setVote(initialVotes[thing.id] || NONE)
        }
    }, [thing, initialVotes, NONE])
    return <>
        <button title="up vote" onClick={() => sendVote(thing.id, vote === UP ? NONE : UP , setVote)} disabled={!initialVotes}>
            <UpArrow className={`w-6 ${vote === UP ? "fill-orange-500" : "fill-fuchsia-500"}`}/>
        </button>
        <button title="down vote" onClick={() => sendVote(thing.id, vote === DOWN ? NONE : DOWN, setVote)} disabled={!initialVotes}>
            <DownArrow className={`w-6 ${vote === DOWN ? "fill-orange-500" : "fill-fuchsia-500"}`}/>
        </button>
    </>
}