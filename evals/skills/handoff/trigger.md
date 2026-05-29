/handoff

We've been debugging a memory leak in the WebSocket handler for the last hour. We found it's caused by event listeners not being removed on disconnect, but we haven't written the fix yet. We also need to add a regression test.
