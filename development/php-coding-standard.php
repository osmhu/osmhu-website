<?php

use Symplify\EasyCodingStandard\Config\ECSConfig;

return ECSConfig::configure()
	->withPaths([
		__DIR__ . '/..',
	])
	->withSkip([
		__DIR__ . '/../distribution',
		__DIR__ . '/../node_modules',
		__DIR__ . '/../testing',
	])
	->withPreparedSets(
		psr12: true
	)
	->withSpacing('tab');
