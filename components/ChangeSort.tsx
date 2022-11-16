import { forwardRef, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import SortIcon from 'svg/sort-desc.svg';
import { useRouter } from 'next/router';
import { API_POSTS } from "lib/api/paths";
import Link from 'next/link';

const MyLink = forwardRef((props: any, ref) => {
    const { href, children, ...rest } = props;
    return (
        <Link href={href}>
            <a ref={ref} {...rest}>
                {children}
            </a>
        </Link>
    )
});

MyLink.displayName = "MyLink"

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ChangeSortButton() {
    const router = useRouter();
    const { page, sort = "hot", sub } = router.query;

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button title="sort">
                    <SortIcon className="w-6 fill-fuchsia-500" alt="sort"/>
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-2 bg-stone-100 text-stone-900 block px-4 text-sm">
                        Change sort
                    </div>
                    <hr/>
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <MyLink href={API_POSTS.queryString({ ...router.query, sort: "new", page: "1" })}
                                    className={classNames(
                                        active ? 'bg-stone-100 text-stone-900' : 'text-stone-700',
                                        'block px-4 py-2 text-sm',
                                        sort === "new" && "font-bold")}>
                                    new
                                </MyLink>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <MyLink href={API_POSTS.queryString({ ...router.query, sort: "hot", page: "1" })}
                                    className={classNames(
                                        active ? 'bg-stone-100 text-stone-900' : 'text-stone-700',
                                        'block px-4 py-2 text-sm',
                                        sort === "hot" && "font-bold")}>
                                    hot
                                </MyLink>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition >
        </Menu >
    )
}