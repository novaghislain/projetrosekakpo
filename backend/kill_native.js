const pids = [10844, 20327];
pids.forEach(pid => {
  try {
    process.kill(pid, 9);
    console.log(`Successfully killed process ${pid}`);
  } catch (e) {
    console.error(`Failed to kill process ${pid}:`, e.message || e);
  }
});
