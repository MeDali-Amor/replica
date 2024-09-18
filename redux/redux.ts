console.log("object");

type Action = {
    type: string;
    paylod?: any;
};

type Reducer<S, A = Action> = (state: S, action: A) => S;

function crerateStore<S, A = Action>(reducer: (state: S, actoin: A) => S) {
    let state: S;
    let listners: (() => void)[] = [];
    function getState(): S {
        return state;
    }
    // dispatcher
    function dispatch(action: A): void {
        state = reducer(state, action);
        listners.forEach((listner) => listner());
    }
    // subscribe
    function subscribe(listner: () => void): () => void {
        listners.push(listner);
        return () => {
            listners = listners.filter((l) => l !== listner);
        };
    }
    return { getState, dispatch, subscribe };
}

interface Increment {
    type: "INCREMENT";
}
interface Decrement {
    type: "DECREMENT";
}
type State = { count: number };

type CounterAction = Increment | Decrement;
const counterReducer: Reducer<State, CounterAction> = (
    state: State = { count: 0 },
    action: CounterAction
): State => {
    switch (action.type) {
        case "INCREMENT":
            return {
                count: state.count + 1,
            };

        case "DECREMENT":
            return {
                count: state.count - 1,
            };

        default:
            return state;
    }
};

const store = crerateStore<State, CounterAction>(counterReducer);

store.subscribe(() => {
    console.log(store.getState());
});
store.dispatch({ type: "DECREMENT" });